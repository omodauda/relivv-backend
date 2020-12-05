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

// const assignVolunteer = async(req, res) => {

//     try{
//         //session id
//         const {id} = req.params;
//         //id of volunteer to assign to session
//         const {volunteer_id} = req.body;

//         //check if session exist
//         const session = await Session.findById(id);
//         if(!session){
//             return res
//             .status(400)
//             .json({
//                 status: 'fail',
//                 error: `No session with id ${id}` 
//             })
//         }
//         //check volunteer
//         const volunteer = await Volunteer.findById(volunteer_id);
//         if(!volunteer){
//             return res
//             .status(400)
//             .json({
//                 status: 'fail',
//                 error: 'volunteer not found in record'
//             })
//         }

//         /* 
//             if session & volunteer are in db,
//             assign volunteer id to session.volunteer &
//             ref session in volunteer's sessions list
//         */
//         session.volunteer = volunteer.id;
//         await session.save();

//         volunteer.sessions.push(session.id);
//         await volunteer.save();

//         res
//         .status(200)
//         .json({
//             status: 'success',
//             message: "volunteer successfully assigned to session"
//         });


//     }catch(error){
//         res
//         .status(400)
//         .json({
//             status: "fail",
//             error: error.message
//         })
//     }
// }

export {
    bookSession,
    // assignVolunteer
};