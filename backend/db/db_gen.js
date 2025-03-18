import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/**
 * Reads a SQL file and generates JavaScript functions, then writes them to a new JS file.
 * @param {string} sqlFilePath - Path to the SQL file.
 * @param {string} outputDir - Directory where generated JS files will be saved.
 */
function generateQueryFiles(sqlFilePath, outputDir) {
    const sqlContent = fs.readFileSync(sqlFilePath, 'utf8').trim();

    // Extract filename without extension
    const fileName = path.basename(sqlFilePath, '.sql');
    const outputFilePath = path.join(outputDir, `${fileName}.js`);

    // Split queries based on `-- name: functionName`
    const queryBlocks = sqlContent.split(/-- name:\s*(\w+)/).slice(1);
    let functionCode = ``;

    for (let i = 0; i < queryBlocks.length; i += 2) {
        const functionName = queryBlocks[i].trim();
        const sqlQuery = queryBlocks[i + 1].trim();

        functionCode += `/**
 * Executes the '${functionName}' query.
 * @param {Object} params - Parameters for the query.
 * @returns {Promise<Array>} - Query result rows.
 */
export async function ${functionName}(pool, params = {}) {
    try {
        const query = \`${sqlQuery}\`;
        const { rows } = await pool.query(query, Object.values(params));
        return rows;
    } catch (error) {
        console.error('Error executing ${functionName}:', error);
        throw error;
    }
}

`;
    }

    // Write the generated JS file
    fs.writeFileSync(outputFilePath, functionCode, 'utf8');
    console.log(`Generated: ${outputFilePath}`);
}

// Example usage
const sqlDirectory = [path.join(__dirname, 'schema', 'sql'), path.join(__dirname, 'queries', 'sql')]; // Folder where .sql files are stored
const outputDirectory = [path.join(__dirname, 'schema', 'generated'), path.join(__dirname, 'queries', 'generated')]; // Output folder for generated JS files

for (let i = 0; i < sqlDirectory.length; i++) {
    // Ensure output directory exists
    if (!fs.existsSync(outputDirectory[i])) {
        fs.mkdirSync(outputDirectory[i], { recursive: true });
    }

    // Process all .sql files in the directory
    fs.readdirSync(sqlDirectory[i]).forEach((file) => {
        if (file.endsWith('.sql')) {
            generateQueryFiles(path.join(sqlDirectory[i], file), outputDirectory[i]);
        }
    });
}
