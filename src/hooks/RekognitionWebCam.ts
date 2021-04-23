/* eslint-disable newline-before-return */
import { Dispatch, useCallback, useState, RefObject, useReducer } from 'react';
import { Predictions } from 'aws-amplify';
import { BoundingBox } from '@aws-amplify/predictions';
import { RecordingStatus } from '../API';
import { createJpegFile4Base64 } from '../util';
import { AppErrorInterface } from '../components/common';
import useFacility from '../hooks/Faclitity';
import Webcam from 'react-webcam';

type Options = {
  webCamRef: RefObject<Webcam & HTMLVideoElement>;
  captureInterval: number;
};

type FacilityState = {
  targetFacilityId: string;
};

type Action = {
  id: string;
  type: 'SET_FACILITY_ID';
};

const initialState: FacilityState = { targetFacilityId: '' };

const reducer = (state: FacilityState = initialState, action: Action) => {
  switch (action.type) {
    case 'SET_FACILITY_ID':
      return { targetFacilityId: action.id };
    default:
      return state;
  }
};

const useRekognitionWebCam = (
  props: Options
): {
  startRecord: (id: string) => Promise<boolean>;
  endRecord: (id: string) => void;
  dispatch: Dispatch<Action>;
  people: BoundingBox[];
  error: AppErrorInterface;
} => {
  const { webCamRef, captureInterval } = props;
  const [recordInterval, setRecordInterval] = useState(0);
  const [people, setPeople] = useState<BoundingBox[]>([]);
  const [state, dispatch] = useReducer(reducer, initialState);
  const [error, setError] = useState<AppErrorInterface>({
    isError: false,
    message: '',
  });
  const { list, updateOne } = useFacility();

  const capture = useCallback(async () => {
    // 1.カメラで画像を撮影する
    if (!webCamRef || !webCamRef.current) {
      return;
    }
    const imageSrc = webCamRef.current.getScreenshot();
    const file = createJpegFile4Base64(imageSrc !== null ? imageSrc : '', '');
    if (!file || file.size === 0) {
      return;
    }
    // 2.Amazon Rekognitionに画像を送信する
    try {
      const result = await Predictions.identify({
        labels: {
          source: {
            file,
          },
          type: 'ALL',
        },
      });
      if (!result || !result.labels) {
        setPeople([]);
        return;
      }
      // 撮影された写真から人物(Personタグ)をカウントする
      const people = result.labels.filter((l) => l.name === 'Person');
      let numberOfPeople = 0;
      if (people.length > 0) {
        setPeople(people[0].boundingBoxes);
        numberOfPeople = people[0].boundingBoxes.length;
      }
      // 3.解析結果をAppSync経由でDynamoDBに登録する
      updateOne({
        id: state.targetFacilityId,
        numberOfPeople,
      });
    } catch (e) {
      console.log(e);
      setError({
        isError: true,
        message: '画像の解析に失敗しました',
      });
    }
  }, [webCamRef, state.targetFacilityId]);

  const startRecord = async (id: string): Promise<boolean> => {
    // 他の施設が使用中の場合はRecordingを開始しない
    if (list.length !== 0 && list[0].id !== id) {
      alert('別の施設でRecording中です');
      return false;
    }
    try {
      // 対象の施設のステータスを「ACTIVE」に更新
      updateOne({
        id,
        recordingStatus: RecordingStatus.ACTIVE,
      });
      // captureInterval(=1秒)に1回の頻度でRekognitionに画像を送信するcaptureメソッドを実行する
      setRecordInterval(window.setInterval(capture, captureInterval));
    } catch {
      setError({
        isError: true,
        message: 'レコードの開始に失敗しました',
      });
      return false;
    }
    return true;
  };

  const endRecord = (id: string) => {
    try {
      clearInterval(recordInterval);
      setPeople([]);
      updateOne({
        id,
        recordingStatus: RecordingStatus.INACTIVE,
      });
    } catch {
      setError({
        isError: true,
        message: 'レコードの停止に失敗しました',
      });
    }
  };

  return { startRecord, endRecord, dispatch, people, error };
};
export default useRekognitionWebCam;
