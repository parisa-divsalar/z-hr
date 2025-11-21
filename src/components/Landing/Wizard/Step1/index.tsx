import { FunctionComponent } from 'react';

import SKillInput from '@/components/Landing/Wizard/Step1/SKillInput';
import SelectSkill from '@/components/Landing/Wizard/Step1/SlectSkill';

interface Step1Props {
  setActiveStep: (activeStep: number) => void;
  showSelectSkill: boolean;
  setShowSelectSkill: (showSelectSkill: boolean) => void;
}
const Step1: FunctionComponent<Step1Props> = (props) => {
  const { setActiveStep, showSelectSkill, setShowSelectSkill } = props;

  if (showSelectSkill) return <SelectSkill setShowSelectSkill={setShowSelectSkill} />;
  else return <SKillInput setShowSelectSkill={setShowSelectSkill} setActiveStep={setActiveStep} />;
};

export default Step1;
