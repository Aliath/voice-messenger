import React, { useContext } from 'react';
import { ServerContext } from 'contexts/ServerContext';
import { Card } from 'components/Card';
import { Input } from 'components/Input';
import './SignInCard.scss';

export const SignInCard: React.FC = () => {
  const { nickName, setNickName } = useContext(ServerContext);

  return (
    <Card className="signin-card">
      <h2 className="signin-card__title">Welcome on board!</h2>
      <p className="signin-card__intro">Pass your nickname to start</p>

      <Input
        value={nickName}
        onChange={(value: string) => {
          setNickName(value);
          localStorage.setItem('voicemessenger-nick', value);
        }}
        className="signin-card__input"
        spellCheck={false}
        autoFocus
      />
    </Card>
  );
};