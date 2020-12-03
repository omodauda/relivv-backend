import Volunteer from '../models/volunteer';
import Auth from '../models/auth';

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
                message: `No volunteer with specified id found`
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
                message: 'volunteer is not email verified'
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
                message: `No volunteer with specified id found`
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

export {
    acceptVolunteer,
    declineVolunteer
};