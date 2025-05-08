import axios from "axios"

export const imageUpload=async image=>{
            const formData=new FormData()
            formData.append('image',image)
            const {data}= await axios.post(`https://api.imgbb.com/1/upload?key=1da593b6ac6e12c2fccb2d913307f35b`,
             formData
            )
            return data.data.display_url
}