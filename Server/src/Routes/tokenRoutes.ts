import { Router } from 'express';
import { reissueAccessToken } from '../Controllers/tokenController';
import { AppError } from '../types/error';

const refreshRouter = Router();

refreshRouter.post('/', async (req, res) => {
  const refreshToken = req.cookies?.refreshToken;

  if (!refreshToken) {
    throw new AppError('Refresh token is missing', 401);
  }

  const accessToken = await reissueAccessToken(refreshToken);

  res.status(200).json({
    status: true,
    message: 'Access token reissued successfully',
    data: { accessToken: accessToken },
  });
});

export default refreshRouter;
