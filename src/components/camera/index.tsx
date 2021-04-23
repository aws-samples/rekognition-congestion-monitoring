/* eslint-disable newline-before-return */
import { FC, SyntheticEvent, useState, useRef, useEffect } from 'react';
import Webcam from 'react-webcam';
import styled from 'styled-components';
import { Button, DropdownProps, Icon } from 'semantic-ui-react';
import useRekognitionWebCam from '../../hooks/RekognitionWebCam';
import useFacility from '../../hooks/Faclitity';
import { RecordingStatus } from '../../API';
import {
  FacilitySelect,
  FacilitySelectInterface,
  AppError,
  Loading,
} from '../common';

const Component: FC = () => {
  const webCamRef = useRef<Webcam & HTMLVideoElement>(null);
  const canvasRef = useRef(null);
  const facility = useFacility();
  const [targetFacilityId, setTargetFacilityId] = useState('');
  // user: インカメラを使用
  // environment: アウトカメラを使用
  const [cameraMode, setCameraMode] = useState<'user' | 'environment'>('user');
  const [isRecording, setIsRecording] = useState(false);
  const {
    startRecord,
    endRecord,
    dispatch,
    people,
    error,
  } = useRekognitionWebCam({
    webCamRef,
    captureInterval: 1000, // 1秒に1回サーバに画像を送信する
  });
  const selectTargetFacility = (
    _: SyntheticEvent<HTMLElement>,
    data: DropdownProps
  ) => {
    const targetId = data.value as string;
    setTargetFacilityId(targetId);
    dispatch({ type: 'SET_FACILITY_ID', id: targetId });
    facility.list.forEach((f) => {
      if (f.id === targetId) {
        setIsRecording(f.recordingStatus === RecordingStatus.ACTIVE);
      }
      if (f.recordingStatus === RecordingStatus.ACTIVE) {
        startRecord(f.id);
      }
    });
  };

  // カメラに写っている人の座標でフレームを描画する
  const drawImge = () => {
    const video = webCamRef.current;
    const canvas = canvasRef.current;
    if (video && canvas) {
      const ctx = canvas.getContext('2d');

      canvas.width = video.video.videoWidth;
      canvas.height = video.video.videoHeight;

      ctx.translate(canvas.width, 0);
      ctx.scale(-1, 1);
      ctx.drawImage(video.video, 0, 0, canvas.width, canvas.height);
      ctx.scale(-1, 1);
      ctx.translate(-canvas.width, 0);
      people.forEach((person) => {
        const X1 = canvas.width * Number(person.left);
        const Y1 = canvas.height * Number(person.top);
        const X2 = canvas.width * Number(person.width);
        const Y2 = canvas.height * Number(person.height);
        ctx.rect(X1, Y1, X2, Y2);
      });
      ctx.lineWidth = '2';
      ctx.strokeStyle = 'green';
      ctx.stroke();
    }
  };

  useEffect(() => {
    drawImge();
  }, [people]);

  const facilitySelectProps: FacilitySelectInterface = {
    placeholder: 'Select facility',
    onChange: selectTargetFacility,
    disable: isRecording,
    list: facility.list,
  };
  return (
    <>
      <div>
        <Container>
          <CanvasArea>
            <canvas ref={canvasRef} style={{ width: '100%', height: '100%' }} />
          </CanvasArea>
          <WebCamArea>
            <Webcam
              audio={false}
              width="100%"
              screenshotFormat="image/png"
              ref={webCamRef}
              screenshotQuality={0.5}
              videoConstraints={{
                facingMode: cameraMode,
              }}
              mirrored={true}
            />
          </WebCamArea>
        </Container>
      </div>
      <InputArea>
        <AppError {...error} />
        <AppError {...facility.error} />
        <FacilitySelect {...facilitySelectProps} />
        <Button
          color="green"
          disabled={isRecording || targetFacilityId === '' || facility.loading}
          onClick={async () => {
            const isSuccess = await startRecord(targetFacilityId);
            setIsRecording(isSuccess);
          }}
        >
          Start
        </Button>
        <Button
          color="purple"
          disabled={!isRecording || facility.loading}
          onClick={() => {
            setIsRecording(false);
            endRecord(targetFacilityId);
          }}
        >
          Stop
        </Button>
        <Button
          color="blue"
          onClick={() =>
            setCameraMode(cameraMode === 'user' ? 'environment' : 'user')
          }
        >
          <Icon name="sync alternate" />
          Face Mode
        </Button>
        {isRecording && <Icon name="record" size="large" color="green" />}
        <AppError {...error} />
        <Loading active={facility.loading} />
      </InputArea>
      {!isRecording ? (
        <h3>施設を選択してStartボタンを押すとレコードを開始します</h3>
      ) : (
        ''
      )}
    </>
  );
};

const Container = styled.div`
  position: relative;
  margin-top: 50px;
`;

const CanvasArea = styled.div`
  position: absolute;
`;

const WebCamArea = styled.div`
  position: absolute;
  opacity: 0;
`;

const InputArea = styled.div`
  position: relative;
  margin-top: -50px;
`;

export default Component;
