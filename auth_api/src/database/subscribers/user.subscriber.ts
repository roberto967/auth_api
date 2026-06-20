import { EntitySubscriberInterface, EventSubscriber, SoftRemoveEvent } from 'typeorm';
import { User } from '../../modules/v1/user/entities/user.entity';
import { RefreshToken } from '../../modules/v1/auth/entities/refreshTokens.entity';
import { ConfirmationToken } from '../../modules/v1/auth/entities/confirmationToken.entity';

@EventSubscriber()
export class UserSubscriber implements EntitySubscriberInterface<User> {
  listenTo() {
    return User;
  }

  async beforeSoftRemove(event: SoftRemoveEvent<User>): Promise<void> {
    if (!event.entity?.id) return;
    const { id } = event.entity;
    await event.manager.delete(RefreshToken, { user: { id } });
    await event.manager.delete(ConfirmationToken, { user: { id } });
  }
}
