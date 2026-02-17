import React, { FunctionComponent, useState } from 'react';

import { Stack } from '@mui/material';

import { AIStatus } from '@/components/Landing/type';
import { MainContainer } from '@/components/Landing/Wizard/Step1/AI/styled';
import VoiceRecord from '@/components/Landing/Wizard/Step1/Common/VoiceRecord';
import MuiButton from '@/components/UI/MuiButton';
import { usePlanGate } from '@/hooks/usePlanGate';

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
    const [showRecordingControls, setShowRecordingControls] = useState<boolean>(false);
    const [_uploadedFiles, _setUploadedFiles] = useState<File[]>([]);
    const { guardAction, planDialog } = usePlanGate();

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
            {planDialog}
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

            {!voiceUrl && showRecordingControls && (
                <VoiceRecord
                    onRecordingComplete={handleVoiceRecordingComplete}
                    showRecordingControls={true}
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
            {!voiceUrl && !showRecordingControls && (
                <Stack width='10rem' mt={2}>
                    <MuiButton
                        fullWidth
                        color='secondary'
                        variant='outlined'
                        size='large'
                        onClick={() => guardAction(() => setShowRecordingControls(true), 'voice_recording')}
                    >
                        Record voice
                    </MuiButton>
                </Stack>
            )}
        </MainContainer>
    );
};

export default AIInput;
