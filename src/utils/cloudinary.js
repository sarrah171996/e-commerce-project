import * as dotenv from 'dotenv'
dotenv.config()
import cloudinary from 'cloudinary';


cloudinary.v2.config({
    // api_key:process.env.api_key,
    // api_secret:process.env.api_secret,
    // cloud_name:process.env.cloud_name,
    // secure: true


    cloud_name: "dogfrivqr",
    api_key: "736315257742598",
    api_secret: "Gqrx4z_g2MKbfAFShnWHa7GP_v8",
    secure: true

})


export default cloudinary.v2;