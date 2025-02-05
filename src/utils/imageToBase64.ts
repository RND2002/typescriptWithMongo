import fs from 'fs';

export const readFileFromLocation = (filePath: string): string | null => {
    if (!filePath?.trim()) {
        return null;
    }
    try {
        const fileBuffer = fs.readFileSync(filePath);
        return fileBuffer.toString('base64'); // Convert Buffer to Base64 string
    } catch (error) {
        console.warn(`No file found in the path: ${filePath}`);
        return null;
    }
};

