import mongoose from 'mongoose';
const schema = mongoose.Schema;

const profileOptions={
    discriminatorKey: 'userType',
    collection: 'profiles'
}

const profileSchema = new schema({}, profileOptions);

const Profile = mongoose.model('Profile', profileSchema);

export default Profile;