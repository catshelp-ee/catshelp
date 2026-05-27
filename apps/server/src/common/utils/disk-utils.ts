import * as fs from 'fs';
import * as path from 'path';

import { BadRequestException, NotFoundException } from '@nestjs/common';
import { getRootPath } from '@server/src/main';
import { v4 as uuidv4 } from 'uuid';

function normalizeBase64String(base64String: string) {
    // Strip the optional data-URL prefix if present
    let result = base64String;

    const dataUrlPattern = /^data:(image\/\w+);base64,/;
    const match = base64String.match(dataUrlPattern);
    if (match) {
        result = base64String.replace(dataUrlPattern, '');
    }
    // Validate that the remaining string is valid base64
    if (!/^[-A-Za-z0-9+/]*={0,3}$/.test(result)) {
        throw new BadRequestException('Invalid base64 image data');
    }
    return result;
}

/**
 * Converts a base64-encoded image string into a file on disk and returns
 * the filename. Accepts both raw base64 and data-URL format (e.g. "data:image/png;base64,<data>").
 */

export async function saveBase64ImageToDisk(
    base64Input: string,
): Promise<string> {
    const normalizedBase64 = normalizeBase64String(base64Input);
    const newFileName = `${uuidv4()}.jpg`;

    const buffer = Buffer.from(normalizedBase64, 'base64');
    const destination = path.join(getRootPath(), 'images');

    const filePath = path.join(destination, newFileName);
    await fs.promises.writeFile(filePath, buffer);

    return newFileName;
}

export async function deleteImageFromDisk(fileName: string): Promise<void> {
    const filePath = path.join(getRootPath(), 'images', fileName);
    try {
        await fs.promises.unlink(filePath);
    } catch (error: any) {
        if (error.code !== 'ENOENT') {
            throw error;
        }
    }
}

export async function getImageFromDisk(fileName: string): Promise<File> {
    const filePath = path.join(getRootPath(), 'images', fileName);
    try {
        const fileBuffer = await fs.promises.readFile(filePath);
        return new File([fileBuffer], fileName, { type: 'image/jpeg' });
    } catch (error: any) {
        if (error.code === 'ENOENT') {
            throw new NotFoundException('Image not found');
        }
        throw error;
    }
}
