import Volunteer from '../models/volunteer';

const getActiveVolunteers = async(req, res) => {
    try{
        const volunteers = await Volunteer.find(
            {status: 'Accepted'}
        )
        .select('-certificate -sessions -authId -__v');
        
        if(volunteers.length === 0){
            return res
            .status(200)
            .json({
                status: 'success',
                message: 'There is currently no active volunteer'
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
};

export {
    getActiveVolunteers
}