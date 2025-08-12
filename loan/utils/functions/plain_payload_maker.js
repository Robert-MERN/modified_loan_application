const plain_payload_maker = (user) => {
    let payload = {
        id: user._id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        isAdmin: user.isAdmin,
        password_update_count: user.password_update_count,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
    }
    return payload;
}

export default plain_payload_maker;