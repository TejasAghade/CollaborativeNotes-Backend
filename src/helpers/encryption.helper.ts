import crypto from 'crypto';
// import bcrypt from 'bcrypt';


class EncryptionHelper {

    // Using a 32-byte key and a 16-byte initialization vector (IV)
    static secretKey = process.env.SECRET_KEY;
    static iv = process.env.IV;

    /**
     * encrypting : crypto
     * @param value - string
     * 
    */
    static encrypt = (value: string) => {
        let secret = Buffer.from(this.secretKey, 'hex');
        let iv = Buffer.from(this.iv, 'hex')
        const cipher = crypto.createCipheriv('aes-256-cbc', secret, iv);
        let encrypted = cipher.update(value, 'utf8', 'hex');
        encrypted += cipher.final('hex');
        return encrypted;
    }


    /**
     * decrypting : crypto
     * @param hash - hash string
     * 
    */
    static decrypt = (hash: string) => {
        let secret = Buffer.from(this.secretKey, 'hex');
        let iv = Buffer.from(this.iv, 'hex')
        const decipher = crypto.createDecipheriv('aes-256-cbc', secret, iv);
        let decrypted = decipher.update(hash, 'hex', 'utf8');
        decrypted += decipher.final('utf8');
        return decrypted;
    }

    // static encryptPassword = async (password: string) => {
    //     let salt = process.env.SALT;
    //     let hash = await bcrypt.hash(password, parseInt(salt));
    //     return hash;
    // }

    // static validatePassoword = async (password: string, hash: string) => {
    //     return await bcrypt.compare(password, hash);
    // }
}

export default EncryptionHelper;