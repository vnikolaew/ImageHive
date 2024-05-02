export const session = async ({ session, token, user, ...rest }: any) => {
    if (session && session.user) {
      (session.user as any).id = token.id;
    }
    return session;
  }
;
