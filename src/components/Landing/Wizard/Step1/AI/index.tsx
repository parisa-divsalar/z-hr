import React, { FunctionComponent, useState } from 'react';

import { Stack } from '@mui/material';

import { AIStatus } from '@/components/Landing/type';
import { MainContainer } from '@/components/Landing/Wizard/Step1/AI/styled';
import VoiceRecord from '@/components/Landing/Wizard/Step1/Common/VoiceRecord';
import MuiButton from '@/components/UI/MuiButton';

interface AIInputProps {
    setAiStatus: (status: AIStatus) => void;
}

export type RecordingState = 'idle' | 'recording';

const AIInput: FunctionComponent<AIInputProps> = (props) => {
    const { setAiStatus } = props;
    const [search, _setSearch] = useState('');
    const [recordingState, setRecordingState] = useState<RecordingState>('idle');
    const [voiceUrl, setVoiceUrl] = useState<string | null>(null);
    const [voiceBlob, setVoiceBlob] = useState<Blob | null>(null);
    const [voiceDuration, setVoiceDuration] = useState<number>(0);
    const [showRecordingControls, setShowRecordingControls] = useState<boolean>(true);
    const [_uploadedFiles, _setUploadedFiles] = useState<File[]>([]);

    const handleVoiceRecordingComplete = (url: string, blob: Blob, duration: number) => {
        setVoiceUrl(url);
        setVoiceBlob(blob);
        setVoiceDuration(duration);
        setShowRecordingControls(false);
    };

    const handleClearVoiceRecording = () => {
        setVoiceUrl(null);
        setVoiceBlob(null);
        setShowRecordingControls(true);
        setVoiceDuration(0);
    };

    return (
        <MainContainer>
            {voiceUrl && (
                <VoiceRecord
                    recordingState={recordingState}
                    setRecordingState={setRecordingState}
                    initialAudioUrl={voiceUrl}
                    initialAudioBlob={voiceBlob}
                    showRecordingControls={showRecordingControls}
                    initialAudioDuration={voiceDuration}
                    onClearRecording={handleClearVoiceRecording}
                />
            )}

            {!voiceUrl && (
                <VoiceRecord
                    onRecordingComplete={handleVoiceRecordingComplete}
                    showRecordingControls={showRecordingControls}
                    recordingState={recordingState}
                    setRecordingState={setRecordingState}
                />
            )}

            {(search !== '' || voiceUrl) && (
                <Stack width='10rem' mt={6}>
                    <MuiButton fullWidth color='secondary' size='large' onClick={() => setAiStatus('WIZARD')}>
                        submit
                    </MuiButton>
                </Stack>
            )}
        </MainContainer>
    );
};

export default AIInput;
