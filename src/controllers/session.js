import { async } from 'regenerator-runtime';
import Session from '../models/session';
import Auth from '../models/auth';
import User from '../models/user';
import Volunteer from '../models/volunteer';

const bookSession = async(req, res) => {
    try{

        const {id: authId} = req.user;

        const {user_age, user_location, designation, session_date, session_time} = req.body;

        //combine session date & time 
        let db_session_date = `${session_date}` +  ` ${session_time}`;

        //can't book a session if account not verified
        const account = await Auth.findById(authId);
        if(account.is_verified === false){
            return res
            .status(400)
            .json({
                status: 'fail',
                error: 'Please verify your account to book a session'
            })
        };

        //get user profile
        const user = await User.findOne({authId});
        //create session
        const newSession = new Session({
            user: user.id,
            user_age,
            user_location,
            designation,
            session_date: db_session_date
        });
        
        await newSession.save();
        //ref session id in user profile
        user.sessions.push(newSession.id);

        await user.save();
 
        res
        .status(200)
        .json({
            status: 'success',
            message: 'session booked successfully'
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

const assignVolunteer = async(req, res) => {

    try{
        //session id
        const {id} = req.params;
        //id of volunteer to assign to session
        const {volunteer_id} = req.body;

        //check if session exist
        const session = await Session.findById(id);
        if(!session){
            return res
            .status(400)
            .json({
                status: 'fail',
                error: `No session with id ${id} in record` 
            })
        }

        //check if session has been previously assigned a volunteer
        if(session.volunteer !== undefined || session.volunteer !== null){
            return res
            .status(400)
            .json({
                status: 'fail',
                error: 'This session has already been assigned a volunteer'
            })
        }
        //check volunteer
        const volunteer = await Volunteer.findById(volunteer_id);
        if(!volunteer){
            return res
            .status(400)
            .json({
                status: 'fail',
                error: 'volunteer not found in record'
            })
        }

        //check if Volunteer profile is Active
        if(volunteer.status !== 'Active'){
            return res
            .status(400)
            .json({
                status: 'fail',
                error: 'This volunteer is currently not active'
            })
        }

        /* 
            if session & volunteer are in db,
            assign volunteer id to session.volunteer &
            ref session in volunteer's sessions list
        */
        session.volunteer = volunteer.id;
        await session.save();

        volunteer.sessions.push(session.id);
        await volunteer.save();

        res
        .status(200)
        .json({
            status: 'success',
            message: "volunteer successfully assigned to session"
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

const volunteerResponse = async(req, res) => {
    try{
        //session id
        const {id} = req.params;
        //volunteer's response
        const {status, message} = req.body;

        //get session
        const session = await Session.findById(id);
        if(!session){
            return res
            .status(400)
            .json({
                status: 'fail',
                message: `No session with id ${id} in record`
            })
        }

        /* 
            the volunteer assigned to session should be the one
            to respond to session
        */
        const volunteer = await Volunteer.findOne({authId: req.user.id});

        if(session.volunteer != volunteer.id){
            return res
            .status(400)
            .json({
                status: 'fail',
                message: "You don't have permission to perform this operation"
            })
        }

        //update session's volunteer response
        session.volunteer_response = {
            status,
            message
        };

        session.isApproved = status === "Accept" ? true : false

        await session.save();

        res
        .status(200)
        .json({
            status: 'success',
            message: "volunteer's response sent"
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
    bookSession,
    assignVolunteer,
    volunteerResponse
};