const ReviewEmployee = require("../models/reviewEmployee");
const ReviewOwner = require("../models/reviewOwner")
const Work = require("../models/work");

exports.reviewEmployee = async (req, res) => {
    try {
        const { companyId, companyName, workDay, employeeId, employeeRating, employeeReviewText } = req.body;

        const review = new ReviewEmployee({
            employeeId,
            companyName,
            workDay,
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

        //employee.employmentStatusRe = 'รีวิวแล้ว';

        // Save the changes to the database
        await work.save();
        await review.save();
        res.status(200).send("รีวิวพนักงานสำเร็จ");
    } catch (error) {
        console.log(error);
        res.status(500).send('Server Error');
        throw error;
    }
};

exports.reviewOwner = async (req, res) => {
    try {
        const { companyId, workDay, companyName, employeeId, employeeFirstName, employeeLastName, employeeRating, employeeReviewText } = req.body;

        console.log(req.body)

        const review = new ReviewOwner({
            companyId,
            employeeId,
            employeeFirstName,
            employeeLastName,
            workDay,
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

        //employee.ownermentStatusRe = 'รีวิวแล้ว';

        // Save the changes to the database
        await work.save();
        await review.save();
        res.status(200).send("รีวิวนายจ้างสำเร็จ");
    } catch (error) {
        console.log(error);
        res.status(500).send('Server Error');
        throw error;
    }
};

exports.getReviewEmployee = async (req, res) => {
    try {
        const id = req.params.id;
        const review = await ReviewEmployee.find({ employeeId: id })
        res.status(200).send(review);
    } catch (error) {
        console.log(error);
        res.status(500).send('Server Error');
        throw error;
    }
};

exports.getReviewOwner = async (req, res) => {
    try {
        const id = req.params.id;
        const review = await ReviewOwner.find({
            companyId
                : id
        })
        res.status(200).send(review);
    } catch (error) {
        console.log(error);
        res.status(500).send('Server Error');
        throw error;
    }
};