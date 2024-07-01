const cron = require('node-cron');
const Work = require("../models/work");

exports.postWork = async (req, res) => {
    try {
        const { companyId, companyName, workPosition, workStartTime, workEndTime, workBreakTime, dailyWage, workDay, numOfEmployee,
            workScope, workWelfare, workDress, companyphoto } = req.body;
        // ตรวจสอบว่า workDay มีค่าหรือไม่ และความยาวมากกว่า 0
        if (workDay && workDay.length > 0) {
            // สร้างและบันทึกข้อมูลงานสำหรับแต่ละวันใน workDay
            const workPromises = workDay.map(day => {
                const work = new Work({
                    companyId,
                    companyName,
                    workPosition,
                    workDay: day,
                    workStartTime,
                    workEndTime,
                    workBreakTime,
                    dailyWage,
                    numOfEmployee,
                    workScope,
                    workWelfare,
                    workDress,
                    companyphoto,
                });
                return work.save();
            });

            // รอการบันทึกข้อมูลทั้งหมดเสร็จสิ้น
            await Promise.all(workPromises);

            res.status(200).send("ประกาศจ้างงานสำเร็จ");
        } else {
            res.status(400).send("workDay ไม่ถูกต้องหรือไม่มีข้อมูล");
        }
    } catch (error) {
        console.log(error);
        res.status(500).send("Server Error");
        throw error;
    }
};

exports.workList = async (req, res) => {
    try {
        const work = await Work.find({}).exec();
        res.status(200).send(work);
    } catch (error) {
        console.log(error);
        res.status(500).send('Server Error');
    }
}

exports.workDescrip = async (req, res) => {
    try {
        const id = req.params.id;
        //console.log(id)
        const work = await Work.find({ _id: id }).exec();
        res.status(200).send(work);
    } catch (error) {
        console.log(error);
        res.status(500).send('Server Error');
    }
}

exports.workDescripList = async (req, res) => {
    try {
        const id = req.params.id;
        const work = await Work.find({
            companyId: id
        }).exec();
        res.status(200).send(work);
    } catch (error) {
        console.log(error);
        res.status(500).send('Server Error');
    }
}

exports.applyWork = async (req, res) => {
    try {
        const work = await Work.findOne({ _id: req.body.company._id }).exec();
        if (!work) {
            return res.status(404).send("Work document not found");
        }
        // Check if the maximum number of employees has been reached
        if (work.numOfReady >= req.body.company.numOfEmployee) {
            return res.status(400).send("พนักงานเต็มแล้ว");
        }

        // Check if the employee has already applied for this job
        const employee = work.employees.find(e => e.employeeId === req.body.employee._id);
        if (employee) {
            return res.status(400).send("สมัครงานนี้ไปแล้ว");
        }
        const otherJobsOnSameDay = await Work.find({
            companyId: { $ne: req.body.company._id }, // Exclude the current job 
            "employees.employeeId": req.body.employee._id, // Check if the employee is already assigned to another job
            workDay: work.workDay,
            "employees.employmentStatus": "พร้อมเริ่มงาน"
        }).exec();
        if (otherJobsOnSameDay.length > 0) {
            return res.status(400).send("มีงานในวันนี้แล้ว");
        }

        // Add the employee to the current job
        work.employees.push({
            employeeId: req.body.employee._id,
            employeeFirstName: req.body.employee.firstName,
            employeeLastName: req.body.employee.lastName,
            employeeAvatar: req.body.employee.avatarphoto,
        });

        // Save the updated work document
        await work.save();

        res.status(200).send("สมัครงานสำเร็จ");
    } catch (error) {
        console.error(error);
        res.status(500).send('Server Error');
    }
};

exports.applyList = async (req, res) => {
    try {
        const id = req.params.id;
        const work = await Work.find({ 'employees.employeeId': id });

        if (!work || work.length === 0) {
            return res.status(404).send('Work not found');
        }

        const employee = work[0].employees.find((emp) => emp.employeeId === id);

        if (!employee) {
            return res.status(404).send('Employee not found in the specified work');
        }
        res.status(200).send(work);
    } catch (error) {
        console.error(error);
        res.status(500).send('Server Error');
    }
};

exports.ChangeEmploymentStatus = async (req, res) => {
    try {
        const workDay = req.body.workDay;
        const companyId = req.body.companyId;
        const employeeId = req.body.employeeId;
        const status = req.body.status;
        const action = req.body.action;

        // Find the work record based on companyId and workDay
        const work = await Work.findOne({ companyId: companyId, workDay: workDay });

        if (!work) {
            return res.status(404).json({ msg: 'Work record not found' });
        }
        // Find the employee within the work record based on employeeId
        const employee = work.employees.find(emp => emp.employeeId === employeeId);

        if (!employee) {
            return res.status(404).json({ msg: 'Employee not found' });
        }

        if (action === 1 && status === 'รอคัดเลือก') {
            employee.employmentStatus = 'ตำแหน่งเต็ม';
        } else if (status === 'รอคัดเลือก' || status === 'ตำแหน่งเต็ม') {
            employee.employmentStatus = 'รอยืนยัน';
        } else if (status === 'รอยืนยัน') {
            employee.employmentStatus = 'ตำแหน่งเต็ม';
        } else if (status === 'พร้อมเริ่มงาน') {
            employee.employmentStatus = 'พร้อมเริ่มงาน';
            work.numOfReady += 1;
        }
        // Save the changes to the database
        await work.save();

        res.status(200).send('สถานะพนักงานถูกอัพเดท');
    } catch (error) {
        console.error(error);
        res.status(500).send('Server Error');
    }
};


exports.CancelWork = async (req, res) => {
    try {
        const workDay = req.body.workDay;
        const companyId = req.body.companyId;
        const employeeId = req.body.employeeId;
        const employmentStatus = req.body.employmentStatus

        const work = await Work.findOne({ companyId: companyId, workDay: workDay });

        if (!work) {
            return res.status(404).json({ msg: 'Work record not found' });
        }

        // Use filter to remove the employee from the employees array
        work.employees = work.employees.filter(emp => emp.employeeId !== employeeId);

        // Decrement numOfReady by 1 only if employmentStatus is not 'รอคัดเลิก'
        if (employmentStatus === 'พร้อมเริ่มงาน') {
            work.numOfReady -= 1;
        }

        // Save the changes to the database
        await work.save();
        res.status(200).send('ยกเลิกสมัครงานสำเร็จ');
    } catch (error) {
        console.error(error);
        res.status(500).send('Server Error');
    }
};

cron.schedule('0 */2 * * *', async () => {
    try {
        const now = new Date(); // เรียกใช้วันที่ปัจจุบัน
        const todayStart = new Date(now.setHours(0, 0, 0, 0)).toISOString();
        // เวลาที่เริ่มต้นของวันนี้
        const todayEnd = new Date(now.setHours(23, 59, 59, 999)).toISOString(); // เวลาสุดท้ายของวันนี้

        const works = await Work.find({
            workDay: {
                $gte: todayStart,
                $lte: todayEnd
            }
        });
        // console.log(todayStart);
        //console.log(works);

        // Process each work item
        for (const work of works) {
            const workStartTime = new Date(work.workDay);
            const twoHoursInMillis = 6 * 60 * 60 * 1000;

            // Check if it has been at least two hours since workStartTime
            //console.log(twoHoursInMillis)
            console.log(now - workStartTime)
            if (now - workStartTime >= twoHoursInMillis) {
                // Filter employees to remove those with specific employment statuses
                const employeesToRemove = work.employees.filter(employee =>
                    employee.employmentStatus === 'รอคัดเลือก' || employee.employmentStatus === 'รอยืนยัน'
                );

                // Remove identified employees
                employeesToRemove.forEach(employeeToRemove => {
                    const index = work.employees.indexOf(employeeToRemove);
                    if (index !== -1) {
                        work.employees.splice(index, 1);
                    }
                });

                // Alternatively, you can use the following to filter out employees:
                // work.employees = work.employees.filter(employee =>
                //     employee.employmentStatus !== 'รอคัดเลือก' && employee.employmentStatus !== 'รอยืนยัน'
                // );

                // Save the updated work document
                await work.save();
            }
        }
        //console.log(`Scheduled task executed successfully.`);
    } catch (error) {
        console.error('Scheduled task failed:', error);
    }
});
