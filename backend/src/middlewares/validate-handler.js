export const validate = (schema) => (req, res, next) => {
    try {
        if (schema.params) schema.params.parse(req.params)
        if (schema.body) schema.body.parse(req.body)
        if (schema.query) schema.query.parse(req.query)
        next()
    } catch (error) {
        const zodErrors = error.issues || error.errors

        if (zodErrors && Array.isArray(zodErrors)) {
            const errorMessages = zodErrors
                .map(e => `${e.path.join('.')}: ${e.message}`)
                .join(', ')
            
            const customError = Object.assign(
                new Error(`Dữ liệu không hợp lệ: ${errorMessages}`), 
                { statusCode: 400 }
            )
            return next(customError)
        }
        
        next(error)
    }
}