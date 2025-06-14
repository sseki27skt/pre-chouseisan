import { getMessages } from '../../messages/en';
import Scheduler from '../../components/Scheduler';

export default function HomePage() {
  const messages = getMessages();
  return <Scheduler messages={messages} locale="en" />;
}
