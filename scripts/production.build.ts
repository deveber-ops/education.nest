import fs from 'fs-extra';
import path from 'path';

async function buildProduction(): Promise<void> {
    const root = path.resolve(__dirname, '..');
    const dist = path.join(root, 'dist');

    await fs.copy(
        path.join(root, 'package.production.json'),
        path.join(dist, './dist/package.json')
    );

    await fs.copy(
        path.join(root, '.env.production'),
        path.join(dist, './dist/.env')
    );

    console.log('✔ Assets copied successfully');
}

buildProduction().catch(err => {
    console.error('❌ Error copying assets:', err);
    process.exit(1);
});