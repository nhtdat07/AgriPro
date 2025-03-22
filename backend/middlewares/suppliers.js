import * as consts from "../consts/consts.js";

// Middleware to validate AddSupplier request data.
export const validateAddSupplierData = (req, res, next) => {
    const { supplierName, address, phoneNumber, email } = req.body;

    if (!supplierName) {
        return res.status(consts.HTTP_STATUS.BAD_REQUEST).json({ error: 'Missing supplier name' });
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