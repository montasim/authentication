import path from 'path';
import fs from 'fs/promises';

const loadTempListFromFile = async (filePath) => {
    const absolutePath = path.join(process.cwd(), filePath);
    const data = await fs.readFile(absolutePath, 'utf8');

    return data;
};

export default loadTempListFromFile;
