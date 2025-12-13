import { FunctionComponent, useEffect, useMemo, useRef, useState } from 'react';

import { Typography } from '@mui/material';

import CleanIcon from '@/assets/images/icons/clean.svg';
import FileIcon from '@/assets/images/icons/icon-file.svg';
import { FilePreviewContainer, FilesStack } from '@/components/Landing/Wizard/Step1/AI/Attach/View/styled';
import { RemoveFileButton } from '@/components/Landing/Wizard/Step1/AI/Text/styled';
import { getFileCategory } from '@/components/Landing/Wizard/Step1/attachmentRules';

interface AttachViewProps {
    voiceUrl: string | null;
    uploadedFiles: File[];
    setUploadedFiles: (value: File[] | ((prev: File[]) => File[])) => void;
}

const isHeicLike = (file: File): boolean => {
    const name = file.name.toLowerCase();
    const type = (file.type || '').toLowerCase();
    return type === 'image/heic' || type === 'image/heif' || name.endsWith('.heic') || name.endsWith('.heif');
};

const isRenderableMediaUrl = (value?: string | null): value is string => {
    if (!value) return false;
    return (
        value.startsWith('blob:') ||
        value.startsWith('data:') ||
        value.startsWith('http://') ||
        value.startsWith('https://')
    );
};

const FileImagePreview: FunctionComponent<{ file: File; url?: string | null }> = ({ file, url }) => {
    const [displayUrl, setDisplayUrl] = useState<string>(isRenderableMediaUrl(url) ? url : '');
    const triedConversionRef = useRef(false);

    useEffect(() => {
        if (isRenderableMediaUrl(url)) {
            setDisplayUrl(url);
            triedConversionRef.current = false;
            return;
        }

        try {
            setDisplayUrl(URL.createObjectURL(file));
        } catch {
            setDisplayUrl('');
        }
        triedConversionRef.current = false;
    }, [file, url]);

    useEffect(() => {
        return () => {
            if (displayUrl !== url) {
                URL.revokeObjectURL(displayUrl);
            }
        };
    }, [displayUrl, url]);

    const tryHeicConversion = async () => {
        if (triedConversionRef.current) return;
        triedConversionRef.current = true;

        // If the current URL got revoked/broken, try refreshing it once.
        try {
            setDisplayUrl(URL.createObjectURL(file));
        } catch {
            // ignore
        }

        if (!isHeicLike(file)) return;

        try {
            const heic2any = (await import('heic2any')).default as any;
            const output = await heic2any({
                blob: file,
                toType: 'image/jpeg',
                quality: 0.9,
            });

            const blob: Blob = Array.isArray(output) ? output[0] : output;
            const convertedUrl = URL.createObjectURL(blob);
            setDisplayUrl(convertedUrl);
        } catch {}
    };

    return displayUrl ? (
        <img
            src={displayUrl}
            alt={file.name}
            onError={() => {
                void tryHeicConversion();
            }}
            style={{
                width: '100%',
                height: '100%',
                objectFit: 'contain',
                backgroundColor: '#F9F9FA',
            }}
        />
    ) : (
        <FileIcon style={{ width: '32px', height: '32px', color: '#666' }} />
    );
};

const AttachView: FunctionComponent<AttachViewProps> = (props) => {
    const { uploadedFiles, setUploadedFiles, voiceUrl } = props;

    const previews = useMemo(() => {
        return uploadedFiles.map((file) => {
            try {
                return { file, url: URL.createObjectURL(file) as string };
            } catch {
                return { file, url: null as string | null };
            }
        });
    }, [uploadedFiles]);

    useEffect(() => {
        return () => {
            previews.forEach(({ url }) => {
                if (url) URL.revokeObjectURL(url);
            });
        };
    }, [previews]);

    const handleRemoveFile = (index: number) => {
        setUploadedFiles((prev) => {
            return prev.filter((_, i) => i !== index);
        });
    };

    return (
        <>
            {uploadedFiles.length > 0 ||
                (voiceUrl && (
                    <Typography variant='h6' color='secondary.main'>
                        Your prompt
                    </Typography>
                ))}

            <FilesStack direction='row' spacing={1}>
                {previews.map(({ file, url }, index) => (
                    <FilePreviewContainer key={`${(file as any)?.id ?? file.name}-${file.lastModified}`}>
                        {getFileCategory(file) === 'image' ? (
                            <FileImagePreview file={file} url={url} />
                        ) : getFileCategory(file) === 'video' ? (
                            url ? (
                                <video
                                    src={url}
                                    controls
                                    playsInline
                                    style={{
                                        width: '100%',
                                        height: '100%',
                                        objectFit: 'contain',
                                        display: 'block',
                                        backgroundColor: '#F9F9FA',
                                    }}
                                />
                            ) : (
                                <FileIcon style={{ width: '32px', height: '32px', color: '#666' }} />
                            )
                        ) : (
                            <FileIcon style={{ width: '32px', height: '32px', color: '#666' }} />
                        )}

                        <RemoveFileButton
                            onClick={() => handleRemoveFile(index)}
                            sx={{
                                width: 24,
                                height: 24,
                                padding: 0,
                                backgroundColor: 'transparent',
                                '&:hover': {
                                    backgroundColor: 'transparent',
                                },
                            }}
                        >
                            <CleanIcon width={24} height={24} />
                        </RemoveFileButton>
                    </FilePreviewContainer>
                ))}
            </FilesStack>
        </>
    );
};

export default AttachView;
