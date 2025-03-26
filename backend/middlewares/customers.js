import * as consts from "../consts/consts.js";

// Middleware to validate AddCustomer request data.
export const validateAddCustomerData = (req, res, next) => {
    const { customerName, address, phoneNumber, email } = req.body;

    if (!customerName) {
        return res.status(consts.HTTP_STATUS.BAD_REQUEST).json({ error: 'Missing customer name' });
    }

    if (!address) {
        return res.status(consts.HTTP_STATUS.BAD_REQUEST).json({ error: 'Missing address' });
    }

    if (!phoneNumber) {
        return res.status(consts.HTTP_STATUS.BAD_REQUEST).json({ error: 'Missing phone number' });
    }
    if (!consts.REGEX.PHONE.test(phoneNumber)) {
        return res.status(consts.HTTP_STATUS.BAD_REQUEST).json({ error: 'Invalid phone number' });
    }

    if (email && !consts.REGEX.EMAIL.test(email)) {
        return res.status(consts.HTTP_STATUS.BAD_REQUEST).json({ error: 'Invalid email' });
    }

    next();
};