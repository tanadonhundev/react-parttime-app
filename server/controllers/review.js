const ReviewEmployee = require("../models/reviewEmployee");
const ReviewOwner = require("../models/reviewOwner")
const Work = require("../models/work");

exports.reviewEmployee = async (req, res) => {
    try {
        const { companyId, workDay, employeeId, employeeRating, employeeReviewText, status } = req.body;
        const review = new ReviewEmployee({
            employeeId,
            employeeRating,
            employeeReviewText
        })
        console.log(req.body)
        const work = await Work.findOne({ companyId: companyId, workDay: workDay });
        if (!work) {
            return res.status(404).json({ msg: 'Work record not found' });
        }
        // Find the employee within the work record based on employeeId
        const employee = work.employees.find(emp => emp.employeeId === employeeId);

        if (!employee) {
            return res.status(404).json({ msg: 'Employee not found' });
        }
        // Check if the status is 'รอคัดเลือก' and update it to 'รอยืนยัน'
        if (status === 'รอรีวิว') {
            employee.employmentStatusRe = 'รีวิวแล้ว';
        }
        // Save the changes to the database
        await work.save();
        await review.save();
        res.send("รีวิวพนักงานสำเร็จ");
    } catch (error) {
        console.log(error);
        res.send("Server Error");
        throw error;
    }
};

exports.reviewOwner = async (req, res) => {
    try {
        const { companyId, workDay, employeeId, employeeRating, employeeReviewText, status } = req.body;
        const review = new ReviewOwner({
            employeeId,
            employeeRating,
            employeeReviewText
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
        // Check if the status is 'รอคัดเลือก' and update it to 'รอยืนยัน'
        if (status === 'รอรีวิว') {
            employee.ownermentStatusRe = 'รีวิวแล้ว';
        }
        // Save the changes to the database
        await work.save();
        await review.save();
        res.send("รีวิวนายจ้างสำเร็จ");
    } catch (error) {
        console.log(error);
        res.send("Server Error");
        throw error;
    }
};