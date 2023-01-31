type DeleteRowData = {
    table: String
    row: {
        [key: string]: string | number | Object | boolean
        [key: number]: string | number | Object | boolean
    }
}

async function DeleteRow(data: DeleteRowData){
    try {
        
    } catch (error: any) {
        throw error.message
    }
}

export default DeleteRow