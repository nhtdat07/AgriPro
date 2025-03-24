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

// Middleware to validate GetSupplierDetails request data.
export const validateGetSupplierDetailsData = (req, res, next) => {
    const { supplierId } = req.params;

    if (!supplierId) {
        return res.status(consts.HTTP_STATUS.BAD_REQUEST).json({ error: 'Missing supplier ID' });
    }

    next();
};

// Middleware to validate EditSupplierDetails request data.
export const validateEditSupplierDetailsData = (req, res, next) => {
    const { supplierId } = req.params;
    const { phoneNumber, email } = req.body;

    if (!supplierId) {
        return res.status(consts.HTTP_STATUS.BAD_REQUEST).json({ error: 'Missing supplier ID' });
    }

    if (!req.body || Object.keys(req.body).length === consts.ZERO_LENGTH) {
        return res.status(consts.HTTP_STATUS.BAD_REQUEST).json({ error: "At least one field must be provided for update" });
    }

    if (phoneNumber && !consts.REGEX.PHONE.test(phoneNumber)) {
        return res.status(consts.HTTP_STATUS.BAD_REQUEST).json({ error: 'Invalid phone number' });
    }

    if (email && !consts.REGEX.EMAIL.test(email)) {
        return res.status(consts.HTTP_STATUS.BAD_REQUEST).json({ error: 'Invalid email' });
    }

    next();
};

// Middleware to validate DeleteSupplier request data.
export const validateDeleteSupplierData = (req, res, next) => {
    const { supplierId } = req.params;

    if (!supplierId) {
        return res.status(consts.HTTP_STATUS.BAD_REQUEST).json({ error: 'Missing supplier ID' });
    }

    next();
};