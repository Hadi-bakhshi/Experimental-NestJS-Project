import { Test } from '@nestjs/testing';
import * as pactum from 'pactum';
import { AppModule } from '../src/app.module';
import { INestApplication } from '@nestjs/common/interfaces';
import { ValidationPipe } from '@nestjs/common/pipes';
import { PrismaService } from '../src/prisma/prisma.service';
import { AuthDto } from '../src/auth/dto';

describe('App e2e', () => {
  let app: INestApplication;
  let prisma: PrismaService;

  beforeAll(async () => {
    // Create A nest server then import the app module
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleRef.createNestApplication();
    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
      }),
    );
    // initialize and listen
    await app.init();
    await app.listen(3333);

    // Prisma DB connection and cleaning
    prisma = app.get(PrismaService);
    await prisma.cleanDb();
    // Pactum base URL
    pactum.request.setBaseUrl('http://localhost:3333');
  });

  afterAll(() => {
    app.close();
  });

  describe('Auth', () => {
    const dto: AuthDto = {
      email: 'vlad@gmail.com',
      password: '123',
    };
    describe('Signup', () => {
      it('should throw if email empty', (): any => {
        return pactum
          .spec()
          .post('/auth/signup')
          .withBody({
            password: dto.password,
          })
          .expectStatus(400);
      });
      it('should throw if password empty', (): any => {
        return pactum
          .spec()
          .post('/auth/signup')
          .withBody({
            email: dto.email,
          })
          .expectStatus(400);
      });
      it('should throw if no body provided', (): any => {
        return pactum.spec().post('/auth/signup').expectStatus(400);
      });
      it('should signup', (): any => {
        return pactum
          .spec()
          .post('/auth/signup')
          .withBody(dto)
          .expectStatus(201);
      });
    });

    describe('Signin', () => {
      it('should throw if email empty', (): any => {
        return pactum
          .spec()
          .post('/auth/signin')
          .withBody({
            password: dto.password,
          })
          .expectStatus(400);
      });
      it('should throw if password empty', (): any => {
        return pactum
          .spec()
          .post('/auth/signin')
          .withBody({
            email: dto.email,
          })
          .expectStatus(400);
      });
      it('should throw if no body provided', (): any => {
        return pactum.spec().post('/auth/signin').expectStatus(400);
      });
      it('should signin', (): any => {
        return pactum
          .spec()
          .post('/auth/signin')
          .withBody(dto)
          .expectStatus(200)
          .stores('userAt', 'accessToken');
      });
    });
  });

  describe('User', () => {
    describe('Get me', () => {
      it('should get current user', (): any => {
        return pactum
          .spec()
          .get('/users/me')
          .withHeaders({
            Authorization: ' Bearer $S{userAt}',
          })
          .expectStatus(200);
      });
    });

    // describe('Edit user', () => {
    //   it('should edit user', (): any => {
    //     const dto: any = {
    //       firstName: 'Vladimir',
    //       email: 'vlad@codewithvlad.com',
    //     };
    //     return pactum
    //       .spec()
    //       .patch('/users')
    //       .withHeaders({
    //         Authorization: 'Bearer $S{userAt}',
    //       })
    //       .withBody(dto)
    //       .expectStatus(200)
    //       .expectBodyContains(dto.firstName)
    //       .expectBodyContains(dto.email);
    //   });
    // });
  });

  // describe('Bookmarks', () => {
  //   describe('Get empty bookmarks', () => {
  //     it('should get bookmarks', (): any => {
  //       return pactum
  //         .spec()
  //         .get('/bookmarks')
  //         .withHeaders({
  //           Authorization: 'Bearer $S{userAt}',
  //         })
  //         .expectStatus(200)
  //         .expectBody([]);
  //     });
  //   });

  //   describe('Create bookmark', () => {
  //     // const dto: CreateBookmarkDto = {
  //     const dto: any = {
  //       title: 'First Bookmark',
  //       link: 'https://www.youtube.com/watch?v=d6WC5n9G_sM',
  //     };
  //     it('should create bookmark', (): any => {
  //       return pactum
  //         .spec()
  //         .post('/bookmarks')
  //         .withHeaders({
  //           Authorization: 'Bearer $S{userAt}',
  //         })
  //         .withBody(dto)
  //         .expectStatus(201)
  //         .stores('bookmarkId', 'id');
  //     });
  //   });

  //   describe('Get bookmarks', () => {
  //     it('should get bookmarks', (): any => {
  //       return pactum
  //         .spec()
  //         .get('/bookmarks')
  //         .withHeaders({
  //           Authorization: 'Bearer $S{userAt}',
  //         })
  //         .expectStatus(200)
  //         .expectJsonLength(1);
  //     });
  //   });

  //   describe('Get bookmark by id', () => {
  //     it('should get bookmark by id', (): any => {
  //       return pactum
  //         .spec()
  //         .get('/bookmarks/{id}')
  //         .withPathParams('id', '$S{bookmarkId}')
  //         .withHeaders({
  //           Authorization: 'Bearer $S{userAt}',
  //         })
  //         .expectStatus(200)
  //         .expectBodyContains('$S{bookmarkId}');
  //     });
  //   });

  //   describe('Edit bookmark by id', () => {
  //     // const dto: EditBookmarkDto = {
  //     const dto: any = {
  //       title:
  //         'Kubernetes Course - Full Beginners Tutorial (Containerize Your Apps!)',
  //       description:
  //         'Learn how to use Kubernetes in this complete course. Kubernetes makes it possible to containerize applications and simplifies app deployment to production.',
  //     };
  //     it('should edit bookmark', (): any => {
  //       return pactum
  //         .spec()
  //         .patch('/bookmarks/{id}')
  //         .withPathParams('id', '$S{bookmarkId}')
  //         .withHeaders({
  //           Authorization: 'Bearer $S{userAt}',
  //         })
  //         .withBody(dto)
  //         .expectStatus(200)
  //         .expectBodyContains(dto.title)
  //         .expectBodyContains(dto.description);
  //     });
  //   });

  //   describe('Delete bookmark by id', () => {
  //     it('should delete bookmark', (): any => {
  //       return pactum
  //         .spec()
  //         .delete('/bookmarks/{id}')
  //         .withPathParams('id', '$S{bookmarkId}')
  //         .withHeaders({
  //           Authorization: 'Bearer $S{userAt}',
  //         })
  //         .expectStatus(204);
  //     });

  //     it('should get empty bookmarks', (): any => {
  //       return pactum
  //         .spec()
  //         .get('/bookmarks')
  //         .withHeaders({
  //           Authorization: 'Bearer $S{userAt}',
  //         })
  //         .expectStatus(200)
  //         .expectJsonLength(0);
  //     });
  //   });
  // });
});
