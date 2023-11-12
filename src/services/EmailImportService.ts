import { EmailRepository } from "../datastore/repositories/EmailRepository";
import { MessageRepository } from "../datastore/repositories/MessageRepository";
import { ThreadRepository } from "../datastore/repositories/ThreadRepository";
import { UserRepository } from "../datastore/repositories/UserRepository";
import { EmailEntity } from "../model/entities/EmailEntity";
import { MessageEntity } from "../model/entities/MessageEntity";
import { ThreadEntity } from "../model/entities/ThreadEntity";
import { EmailFetcherService } from "./EmailFetcherService";

export class EmailImportService {
  constructor(
    private readonly emailFetcherService: EmailFetcherService,
    private readonly emailRepository: EmailRepository,
    private readonly messageRepository: MessageRepository,
    private readonly threadRepository: ThreadRepository,
    private readonly userRepository: UserRepository
  ) {}

  public async import(): Promise<void> {
    const fetchedEmails = await this.retrieveAndPersistEmails();

    const threads = new Map<string, ThreadEntity>();

    for (const email of fetchedEmails) {
      let thread: ThreadEntity;

      if (email.inReplyTo) {
        thread =
          threads.get(email.inReplyTo.email.value) ??
          (await this.createNewThread(email.subject));
        threads.set(email.universalMessageId.email.value, thread);
      } else {
        thread = await this.createNewThread(email.subject);
        threads.set(email.universalMessageId.email.value, thread);
      }

      const message = await this.createMessageFromEmail(email, thread);
      await this.messageRepository.persist([message]);
    }
  }

  private async createNewThread(subject: string): Promise<ThreadEntity> {
    const newThread = new ThreadEntity(subject);
    await this.threadRepository.persist([newThread]);
    return newThread;
  }
  private async retrieveAndPersistEmails() {
    const fetchedEmails = await this.emailFetcherService.fetch();
    await this.emailRepository.persist(fetchedEmails);
    return fetchedEmails;
  }

  private async createMessageFromEmail(
    email: EmailEntity,
    thread: ThreadEntity
  ): Promise<MessageEntity> {
    const user = await this.userRepository.findByEmail(email.from.email);
    const messageSenderId = user?.id ?? null;

    const message = MessageEntity.createFromEmail(
      messageSenderId,
      thread.id!,
      email
    );
    return message;
  }
}
