import Volunteer from '../models/volunteer';
import Auth from '../models/auth';

const getAllVolunteers = async(req, res) => {
    try{
        const volunteers = await Volunteer.find();
        if(volunteers.length === 0){
            return res
            .status(200)
            .json({
                status: 'success',
                message: 'No volunteers in record'
            })
        }

        res
        .status(200)
        .json({
            status: 'success',
            count: volunteers.length,
            data: volunteers
        })
    }catch(error){
        res
        .status(400)
        .json({
            status: "fail",
            error: error.message
        })
    }
}

const acceptVolunteer = async(req, res) => {
    try{
        const {id} = req.params;
        //id === volunteer profile id
        //check if a volunteer with id exists
        const volunteer = await Volunteer.findById(id);
        if(!volunteer){
            return res
            .status(400)
            .json({
                status: "fail",
                error: `No volunteer with specified id found`
            })
        };

        //check if volunteer has been previously accepted
        const status = volunteer.status;
        if(status === "Accepted"){
            return res
            .status(200)
            .json({
                status: 'fail',
                message: 'volunteer has already been accepted'
            })
        }

        //check if volunteer is email verified
        const authId = volunteer.authId;
        const auth = await Auth.findById(authId);
        const isVerified = auth.is_verified;

        if(isVerified === false){
            return res
            .status(400)
            .json({
                status: "fail",
                error: 'volunteer is not email verified'
            })
        }else if (isVerified === true){
            await Volunteer.findByIdAndUpdate(id, {status: "Accepted"});
            res
            .status(200)
            .json({
                status: "success",
                message: 'volunteer accepted'
            });
        }

    }catch(error){
        res
        .status(400)
        .json({
            status: "fail",
            error: error.message
        })
    }
}

const declineVolunteer = async(req, res) => {
    try{
        const {id} = req.params;
        //id === volunteer profile id
        //check if a volunteer with id exists
        const volunteer = await Volunteer.findById(id);
        if(!volunteer){
            return res
            .status(400)
            .json({
                status: "fail",
                error: `No volunteer with specified id found`
            })
        };

        await Volunteer.findByIdAndUpdate(id, {status: "Declined"});
        res
        .status(200)
        .json({
            status: 'success',
            message: 'volunteer successfully declined'
        });
    }catch(error){
        res
        .status(400)
        .json({
            status: "fail",
            error: error.message
        })
    }
};

const suspendVolunteer = async(req, res) => {
    try{
        const {id} = req.params;
        //check if a volunteer with id exists
        const volunteer = await Volunteer.findById(id);
        if(!volunteer){
            return res
            .status(400)
            .json({
                status: "fail",
                error: `No volunteer with specified id found`
            })
        };
        await Volunteer.findByIdAndUpdate(id, {status: "Suspended"});
        res
        .status(200)
        .json({
            status: 'success',
            message: 'volunteer successfully suspended'
        });

    }catch(error){
        res
        .status(400)
        .json({
            status: "fail",
            error: error.message
        })
    }
};

export {
    getAllVolunteers,
    acceptVolunteer,
    declineVolunteer,
    suspendVolunteer
};