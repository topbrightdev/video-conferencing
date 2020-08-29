export const getErrorMessage = (error: any) => {
    const { response } = error;
    if (error.response) {
        return response.data.message;
    }
    return error.message;
};
