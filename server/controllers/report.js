const ReportOwner = require("../models/reportOwner");

const Work = require("../models/work");

exports.reportOwner = async (req, res) => {
    try {
        const { companyId, workDay, companyName, secReportText, reportText, employeeId, employeeFirstName, employeeLastName } = req.body;

        const report = new ReportOwner({
            companyName,
            secReportText,
            reportText,
            employeeFirstName,
            employeeLastName
        })
        //console.log(req.body)

        const work = await Work.findOne({ companyId: companyId, workDay: workDay });
        if (!work) {
            return res.status(404).json({ msg: 'Work record not found' });
        }
        // Find the employee within the work record based on employeeId
        const employee = work.employees.find(emp => emp.employeeId === employeeId);

        if (!employee) {
            return res.status(404).json({ msg: 'Employee not found' });
        }

        employee.ownermentStatusRe = 'รีวิวแล้ว';

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