export let mongo = (err) => {
    err = err.errors;
    if (!err) return null
    let errorCode = 500;
    let message = "Something went wrong."
    let checked = false
    let tag = 5143
    let additionalData = {}
    _.mapKeys(err, (v, k) => {
        if (checked) return
        if (v["$isValidatorError"]) {
            errorCode = 400,
                additionalData = {
                    kind: v.kind,
                    key: v.path
                }
        }
        message = v.message
    })
    return { code: errorCode, message, tag, additionalData }
}
export let customError = (err) => {
    if (typeof (err) == "object") {
        let { tag, code, message, kind } = err
        if (!code) code = 500;
        if (!tag) tag = 1000

        return { code, tag, message, kind }
    }
    else {
        return { code: 500, tag: 1000, message: err }
    }
}
export default async (err, name = "", res) => {
    console.error(name, ">", err)
    if (err.errors) {
        let mongoErr = mongo(err)
        if (mongoErr) {
            let { code, message, tag, additionalData } = mongoErr
            return res.validSend(code, { error: message, tag, ...additionalData })
        }
    }
    let customErr = customError(err)
    let { code, message, tag, kind } = customErr
    return res.validSend((code < 200 || code > 999) ? 500 : code, { error: message, tag, kind })
}
