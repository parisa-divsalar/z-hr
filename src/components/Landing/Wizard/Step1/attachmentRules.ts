export type LimitedFileCategory = 'image' | 'video' | 'pdf' | 'word';
export type FileCategory = LimitedFileCategory | 'other';

export const MAX_IMAGE_ATTACHMENTS = 2;
export const MAX_WORD_FILE_ATTACHMENTS = 2;
export const MAX_PDF_ATTACHMENTS = 2;
export const MAX_VIDEO_ATTACHMENTS = 2;
export const MAX_VIDEO_FILE_DURATION_SECONDS = 60;
export const MAX_VOICE_RECORDINGS = 3;
export const MAX_VOICE_DURATION_SECONDS = 90;

export const FILE_CATEGORY_LIMITS: Record<LimitedFileCategory, number> = {
    image: MAX_IMAGE_ATTACHMENTS,
    video: MAX_VIDEO_ATTACHMENTS,
    pdf: MAX_PDF_ATTACHMENTS,
    word: MAX_WORD_FILE_ATTACHMENTS,
};

export const FILE_CATEGORY_TOAST_LABELS: Record<LimitedFileCategory, string> = {
    image: 'images',
    video: 'videos',
    pdf: 'PDF files',
    word: 'Word files',
};

export const FILE_CATEGORY_DISPLAY_LABELS: Record<LimitedFileCategory, string> = {
    image: 'Image',
    video: 'Video',
    pdf: 'PDF',
    word: 'Word',
};

const imageExtensions = [
    'png',
    'jpg',
    'jpeg',
    'jfif',
    'pjpeg',
    'pjp',
    'webp',
    'avif',
    'gif',
    'bmp',
    'svg',
    'ico',
    'apng',
    'tif',
    'tiff',
    'heic',
    'heif',
];
const videoExtensions = ['mp4', 'webm', 'mov', 'm4v', 'ogv', 'avi', 'mkv'];

export const getFileCategory = (file: File): FileCategory => {
    const lowerCasedName = file.name.toLowerCase();
    const ext = lowerCasedName.split('.').pop() ?? '';

    if (file.type.startsWith('image/') || imageExtensions.includes(ext)) {
        return 'image';
    }

    if (file.type.startsWith('video/') || videoExtensions.includes(ext)) {
        return 'video';
    }

    if (file.type === 'application/pdf' || lowerCasedName.endsWith('.pdf')) {
        return 'pdf';
    }

    const wordMimeTypes = [
        'application/msword',
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    ];
    if (wordMimeTypes.includes(file.type) || lowerCasedName.endsWith('.doc') || lowerCasedName.endsWith('.docx')) {
        return 'word';
    }

    return 'other';
};

export const getFileTypeDisplayName = (file: File): string => {
    const category = getFileCategory(file);

    if (category !== 'other') {
        return FILE_CATEGORY_DISPLAY_LABELS[category];
    }

    const extension = file.name.split('.').pop()?.toUpperCase();
    return extension ? `${extension} File` : 'File';
};

export const isVideoDurationValid = (file: File): Promise<boolean> =>
    new Promise((resolve) => {
        const url = URL.createObjectURL(file);
        const videoElement = document.createElement('video');
        videoElement.preload = 'metadata';

        const cleanup = () => {
            URL.revokeObjectURL(url);
        };

        videoElement.onloadedmetadata = () => {
            cleanup();
            resolve(videoElement.duration <= MAX_VIDEO_FILE_DURATION_SECONDS);
        };

        videoElement.onerror = () => {
            cleanup();
            resolve(false);
        };

        videoElement.src = url;
    });

export const isDuplicateFile = (target: File, files: File[]): boolean =>
    files.some(
        (file) => file.name === target.name && file.size === target.size && file.lastModified === target.lastModified,
    );
