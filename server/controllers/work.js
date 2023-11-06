const Work = require("../models/work");

exports.postWork = async (req, res) => {
    try {
        const { companyId, companyName, workPosition, workStartTime, workEndTime, workBreakTime, dailyWage, workDay, numOfEmployee, companyphoto } = req.body;
        console.log(req.body)
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
                    companyphoto,
                });
                return work.save();
            });

            // รอการบันทึกข้อมูลทั้งหมดเสร็จสิ้น
            await Promise.all(workPromises);

            res.send("สร้างงานสำเร็จ");
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
        res.send(work);
    } catch (error) {
        console.log(error);
        res.send('Server Error');
    }
}

exports.workDescrip = async (req, res) => {
    try {
        const id = req.params.id;
        //console.log(id)
        const work = await Work.find({ _id: id }).exec();
        res.send(work);
    } catch (error) {
        console.log(error);
        res.send('Server Error');
    }
}

exports.workDescripList = async (req, res) => {
    try {
        const id = req.params.id;
        const work = await Work.find({
            companyId: id
        }).exec();
        res.send(work);
    } catch (error) {
        console.log(error);
        res.send('Server Error');
    }
}

exports.applyWork = async (req, res) => {
    try {
        console.log(req.body)
        const work = await Work.findOne({ _id: req.body.company._id }).exec();
        if (work.employees.length >= req.body.company.numOfEmployee) {
            console.log("พนักงานเต็มแล้ว")
        } else {
            if (work) {
                const employee = work.employees.find(e => e.employeeId === req.body.employee._id);
                if (!employee) {
                    work.employees.push({
                        employeeId: req.body.employee._id,
                        employeeFristName: req.body.employee.firstName,
                        employeeLastName: req.body.employee.lastName,
                        employeeAvatar: req.body.employee.avatarphoto
                    });
                    await work.save();
                    console.log("สมัครงานสำเร็จ");
                }
                else {
                    console.log("สมัครงานนี้ไปแล้ว")
                }
            } else {
                console.log("Work document not found for companyId: " + id);
            }

            // Send a response to the client
            res.send("Employee added or Work document not found.");
        }
    } catch (error) {
        console.log(error);
        res.status(500).send('Server Error');
    }
}

