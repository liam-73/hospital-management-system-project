const userServices = require('../services/user');

const { doctorPropeties, patientProperties } = require("../constants/user.properties");

const addUser = async (request_body, file) => {
    const user = await userServices.addUser( request_body, file );

    return user;
};

const getUserById = async ( user_id ) => {
    const user = await userServices.getUserById( user_id );

    return user;
};

const editUser = async (request_body, user_id, file) => {
    const user = await userServices.editUser( request_body, user_id, file );

    return user;
};

const deleteUser = async( user_id ) => {
    const user = await userServices.deleteUser(user_id);

    return user;
}

const getAllUsers = async () => {
    const users = await userServices.getAllUsers();

    return users;
};

const getAllEmployees = async () => {
    const users = await userServices.getAllEmployees();

    return users;
}

const getUsersByRole = async (role) => {
    const users = await userServices.getUsersByRole(role);

    return users;
}

const getPatientsByDate = async (start_date, end_date) => {
    const data = await userServices.getPatientsByDate(start_date, end_date);

    return data;
};

const getStaffsByDate = async (start_date, end_date) => {
    const data = await userServices.getStaffsByDate(start_date, end_date);

    return data;
};

const getUsersByNameAndRole = async (name, role) => {
    const data = await userServices.getUsersByNameAndRole(name, role);

    return data;
};

const getStaffsByName = async (name) => {
    const data = await userServices.getStaffsByName(name);

    return data;
};

const getDoctorByEmail = async (email) => {
    const data = await userServices.getDoctorByEmail(email);

    return data;
};

const getPatientByEmail = async (email) => {
    const data = await userServices.getPatientByEmail(email);

    return data;
};

module.exports = {
    addUser,
    getUserById,
    editUser,
    deleteUser,
    getAllUsers,
    getUsersByRole,
    getPatientsByDate,
    getStaffsByDate,
    getUsersByNameAndRole,
    getStaffsByName,
    getAllEmployees,
    getDoctorByEmail,
    getPatientByEmail,
}