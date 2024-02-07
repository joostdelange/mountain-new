import { defineRule } from 'vee-validate';
import { required, email, min, max, numeric } from '@vee-validate/rules';

export default () => {
  defineRule('required', required);
  defineRule('email', email);
  defineRule('min', min);
  defineRule('max', max);
  defineRule('numeric', numeric);
};
