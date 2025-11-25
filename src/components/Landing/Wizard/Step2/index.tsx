import React, { FunctionComponent } from 'react';

import Thinking from '@/components/Landing/Wizard/Step2/Thinking';

interface Step2Props {
  setActiveStep: (activeStep: number) => void;
}
const Step2: FunctionComponent<Step2Props> = (props) => {
  const { setActiveStep } = props;

  return <Thinking onCancel={() => setActiveStep(1)} setActiveStep={setActiveStep} />;
};

export default Step2;
