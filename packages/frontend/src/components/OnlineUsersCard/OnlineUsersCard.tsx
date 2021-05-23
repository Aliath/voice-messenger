import React, { useContext } from 'react';
import { usePopperTooltip } from 'react-popper-tooltip';
import { Card } from 'components/Card';
import './OnlineUsersCard.scss';
import { ServerContext } from 'contexts/ServerContext';

type OnlineUserProps = {
  nickName: string;
}

const OnlineUser: React.FC<OnlineUserProps> = ({ nickName }) => {
  const {
    getTooltipProps,
    setTooltipRef,
    setTriggerRef,
    visible,
  } = usePopperTooltip({placement: 'top'});

  return (
    <>
      <div ref={setTriggerRef} className="online-user">
        {nickName[0]}
      </div>
      {visible && (
        <div
          ref={setTooltipRef}
          {...getTooltipProps({ className: 'online-user-tooltip' })}
        >
          {nickName}
        </div>
      )}
    </>
  )
}

export const OnlineUsersCard: React.FC = () => {
  const { onlineUsers } = useContext(ServerContext);

  return (
    <Card className="online-users">
      <div className="online-users__wrapper">
        {onlineUsers.map(nickName => <OnlineUser nickName={nickName} key={nickName} />)}
      </div>
    </Card>
  );
};
