const cron = require('node-cron');
const Work = require("../models/work");
const dayjs = require("dayjs")

exports.postWork = async (req, res) => {
    try {
        const { companyId, companyName, workPosition, workStartTime, workEndTime, workBreakTime, dailyWage, workDay, numOfEmployee,
            workScope, workWelfare, workDress, companyphoto, lat, lng } = req.body;
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
                    lat,
                    lng,
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

        // Check if the employee has already applied for another job on the same day
        const otherJobsOnSameDay = await Work.find({
            companyId: { $ne: req.body.company._id }, // Exclude the current job
            workDay: work.workDay,
            employees: {
                $elemMatch: {
                    employeeId: req.body.employee._id,
                    employmentStatus: 'พร้อมเริ่มงาน'
                }
            }
        }).exec();
        if (otherJobsOnSameDay.length > 0) {
            return res.status(400).send("มีงานในวันนี้แล้ว");
        }

        // Check if the employee has applied for more than 3 jobs on the same day
        const jobsOnSameDay = await Work.find({
            workDay: work.workDay,
            employees: {
                $elemMatch: {
                    employeeId: req.body.employee._id,
                }
            }
        }).exec();
        if (jobsOnSameDay.length >= 3) {
            return res.status(400).send("ห้ามสมัครงานเกิน 3 งานในวันเดียวกัน");
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
        const { workDay, workId, employeeId, status, action } = req.body;

        // Check if there are other works with the same workDay and 'พร้อมเริ่มงาน'
        const otherWorks = await Work.find({
            _id: { $ne: workId },
            workDay: workDay,
            employees: {
                $elemMatch: {
                    employeeId: employeeId,
                    employmentStatus: 'พร้อมเริ่มงาน'
                }
            }
        });

        if (otherWorks.length > 0) {
            // Find the work record based on workId and workDay
            const work = await Work.findOne({ _id: workId, workDay: workDay });

            if (!work) {
                return res.status(404).json({ msg: 'Work record not found' });
            }

            // Find the employee within the work record based on employeeId
            const employee = work.employees.find(emp => emp.employeeId === employeeId);

            if (!employee) {
                return res.status(404).json({ msg: 'Employee not found' });
            }

            employee.employmentStatus = 'ถูกยกเลิก';
            await work.save();
            return res.status(200).send('พนักงานมีงานในวันอื่นแล้ว');
        }

        // Find the work record based on workId and workDay
        const work = await Work.findOne({ _id: workId, workDay: workDay });

        if (!work) {
            return res.status(404).json({ msg: 'Work record not found' });
        }

        // Find the employee within the work record based on employeeId
        const employee = work.employees.find(emp => emp.employeeId === employeeId);

        if (!employee) {
            return res.status(404).json({ msg: 'Employee not found' });
        }

        // Update employee status based on conditions
        if (action === 1 && status === 'รอคัดเลือก') {
            employee.employmentStatus = 'ตำแหน่งเต็ม';
        } else if (status === 'รอคัดเลือก' || status === 'ตำแหน่งเต็ม') {
            employee.employmentStatus = 'พร้อมเริ่มงาน';
            work.numOfReady += 1;
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
        //const companyId = req.body.companyId;
        const employeeId = req.body.employeeId;
        const employmentStatus = req.body.employmentStatus
        const workId = req.body.workId


        const work = await Work.findOne({ _id: workId, workDay: workDay });

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

exports.CancelWork1 = async (req, res) => {
    try {
        const workId = req.body.workId;
        const workDay = req.body.workDay;

        const work = await Work.findOne({ _id: workId, workDay: workDay });

        if (!work) {
            return res.status(404).send('ไม่พบงานที่ต้องการยกเลิก');
        }

        if (work.employees.length > 0) {
            return res.status(400).send('ไม่สามารถยกเลิกงานได้เนื่องจากมีพนักงานมีพนักงานมาสมัครงานแล้ว');
        }

        await Work.deleteOne({ _id: workId, workDay: workDay });

        res.status(200).send('ยกเลิกสมัครงานสำเร็จ');
    } catch (error) {
        console.error(error);
        res.status(500).send('Server Error');
    }
};


// cron.schedule('*/10 * * * * *', async () => {
//     try {
//         const now = new Date(); // Current date and time
//         const todayStart = new Date(now.setHours(0, 0, 0, 0)).toISOString(); // Start of today
//         const todayEnd = new Date(now.setHours(23, 59, 59, 999)).toISOString(); // End of today

//         const works = await Work.find({
//             workDay: {
//                 $gte: todayStart,
//                 $lte: todayEnd
//             }
//         });

//         for (const work of works) {
//             const workDay = new Date(work.workDay);
//             const workStartTime = new Date(work.workStartTime);

//             // Combine workDay date with workStartTime time
//             const combinedWorkStartTime = new Date(
//                 Date.UTC(
//                     workDay.getUTCFullYear(),
//                     workDay.getUTCMonth(),
//                     workDay.getUTCDate(),
//                     workStartTime.getUTCHours(),
//                     workStartTime.getUTCMinutes(),
//                     workStartTime.getUTCSeconds()
//                 )
//             );

//             // Add 24 hours to the combinedWorkStartTime
//             const combinedWorkStartTimeWith24Hours = new Date(combinedWorkStartTime.getTime() + (24 * 60 * 60 * 1000));

//             // Calculate two hours in milliseconds
//             const twoHoursInMillis = 1 * 60 * 60 * 1000;

//             const now = new Date(); // Current time

//             // Check if it is less than two hours before the workStartTime (after adding 24 hours)
//             // console.log(combinedWorkStartTimeWith24Hours - now)
//             //console.log(twoHoursInMillis)
//             if (combinedWorkStartTimeWith24Hours - now <= twoHoursInMillis) {
//                 // Filter employees to remove those with specific employment statuses
//                 const employeesToRemove = work.employees.filter(employee =>
//                     employee.employmentStatus === 'รอคัดเลือก' || employee.employmentStatus === 'รอยืนยัน'
//                 );

//                 // Remove identified employees
//                 employeesToRemove.forEach(employeeToRemove => {
//                     const index = work.employees.indexOf(employeeToRemove);
//                     if (index !== -1) {
//                         work.employees.splice(index, 1);
//                     }
//                 });

//                 await work.save();
//             }
//         }

//         //console.log(`Scheduled task executed successfully.`);
//     } catch (error) {
//         console.error('Scheduled task failed:', error);
//     }
// });
