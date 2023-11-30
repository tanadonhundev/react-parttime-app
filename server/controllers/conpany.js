const Company = require("../models/company");

exports.createCompany = async (req, res) => {
    try {
        const { companyId, companyName, workPosition, workDay, workStartTime, workEndTime, workBreakTime, dailyWage, workScope, workWelfare, workDress } = req.body;

        const company = new Company({
            companyId,
            companyName,
            workPosition,
            workDay,
            workStartTime,
            workEndTime,
            workBreakTime,
            dailyWage,
            workScope,
            workWelfare,
            workDress
        });
        await company.save();
        res.send("สร้างประกาศจ้างงานสำเร็จ");
    } catch (error) {
        console.log(error);
        res.send("Server Error");
        throw error;
    }
};

exports.deleteCompany = async (req, res) => {
    try {
        id = req.body.id
        await Company.findOneAndDelete({ _id: id });
        res.send("ลบประกาศจ้างงานสำเร็จ");
    } catch (error) {
        console.log(error);
        res.send("Server Error");
        throw error;
    }
};

exports.companyList = async (req, res) => {
    try {
        const id = req.params.id;
        //console.log(id)
        const company = await Company.find({ companyId: id });
        res.send(company)
    } catch (error) {
        console.log(error);
        res.send('Server Error');
    }
}

exports.companyDescrip = async (req, res) => {
    try {
        const id = req.params.id;
        const workDetails = await Company.findOne({ _id: id });
        res.send(workDetails)
    } catch (error) {
        console.log(error);
        res.send('Server Error');
    }
}