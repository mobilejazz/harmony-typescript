export class StringUtils {
    public static randomString(
        length = 8,
        charset = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789',
    ): string {
        let str = '';
        for (let i = 0, n = charset.length; i < length; ++i) {
            str += charset.charAt(Math.floor(Math.random() * n));
        }
        return str;
    }
}
