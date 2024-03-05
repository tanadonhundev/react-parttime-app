const Report = require("../models/report");
const Work = require("../models/work");
const User = require("../models/user");

exports.report = async (req, res) => {
    try {
        const { reporter, workDay, reportText, peopleReporter, companyId, employeeId } = req.body;

        const report = new Report({
            reporter,
            workDay,
            peopleReporter,
            reportText,
        })

        const work = await Work.findOne({ companyId: companyId, workDay: workDay });
        if (!work) {
            return res.status(404).json({ msg: 'Work record not found' });
        }
        // Find the employee within the work record based on employeeId
        const employee = work.employees.find(emp => emp.employeeId === employeeId);

        if (!employee) {
            return res.status(404).json({ msg: 'Employee not found' });
        }

        if (reporter === employeeId) {
            employee.ownermentStatusRe = 'รีวิวแล้ว';
        }
        employee.employmentStatusRe = 'รีวิวแล้ว';
        // Save the changes to the database
        await work.save();
        await report.save();
        res.status(200).send("รายงานนายจ้างสำเร็จ");
    } catch (error) {
        console.log(error);
        res.status(500).send('Server Error');
        throw error;
    }
};

exports.getReport = async (req, res) => {
    try {
        const report = await Report.find({}).exec();
        const reporterIds = report.map(entry => entry.reporter);
        const peopleReporterIds = report.map(entry => entry.peopleReporter);

        const usersByReporterId = await Promise.all(reporterIds.map(id => User.findById(id, { firstName: 1, lastName: 1 }).exec()));
        const usersBypeopleReporterId = await Promise.all(peopleReporterIds.map(id => User.findById(id, { firstName: 1, lastName: 1 }).exec()));

        // สร้างอ็อบเจ็กต์ที่ใช้ในการจับคู่ข้อมูลของผู้ใช้กับบริษัทและพนักงานในรายงาน
        const usersMap = new Map();
        usersByReporterId.forEach(user => usersMap.set(user._id.toString(), user));
        usersBypeopleReporterId.forEach(user => usersMap.set(user._id.toString(), user));

        // รวมข้อมูลระหว่างผู้ใช้กับบริษัทและพนักงานในรายงาน
        const mergedReport = report.map(entry => ({
            ...entry.toObject(),
            reporterInfo: usersMap.get(entry.reporter.toString()),
            peopleReporterInfo: usersMap.get(entry.peopleReporter.toString())
        }));

        return res.send(mergedReport);
    } catch (error) {
        console.log(error);
        res.status(500).send('Server Error');
        throw error;
    }
};


