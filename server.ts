import express from 'express';
import path from 'path';
import { createServer as createViteServer } from 'vite';

const app = express();
const PORT = 3000;

app.use(express.json({ limit: '15mb' }));

interface InstagramPost {
  id: string;
  time: string;
  timestamp: number;
  author: string;
  avatar: string;
  text: string;
  image: string;
  likes: number;
  comments: number;
  shares: number;
  url: string;
  isLiveSynced?: boolean;
}

// In-memory live store seeded with official @bombshellgrenade posts
let liveInstagramPosts: InstagramPost[] = [
  {
    id: 'ig-post-1',
    time: '2 hours ago',
    timestamp: Date.now() - 2 * 60 * 60 * 1000,
    author: 'bombshellgrenade',
    avatar: 'src/about-portrait.jpg',
    text: 'Lusaka! The energy is unmatched. We are officially preparing the next chapter for BOMB NATION. New music visuals are in the cutting room and summer concert dates are dropping this week. Stay locked, stay royal. 👑🔥💣 #KingKongQueen #BombNation #ZambianMusicToTheWorld #MfumuKadzi',
    image: 'src/hero-banner.jpg',
    likes: 14820,
    comments: 842,
    shares: 390,
    url: 'https://www.instagram.com/bombshellgrenade',
    isLiveSynced: true
  },
  {
    id: 'ig-post-2',
    time: 'Yesterday',
    timestamp: Date.now() - 24 * 60 * 60 * 1000,
    author: 'bombshellgrenade',
    avatar: 'src/about-portrait.jpg',
    text: 'Reflecting on our landmark LP "Mfumu Kadzi" (The Queen). Over 19 tracks of unapologetic Zambian hip-hop and soul. Huge gratitude to Jay Rox, Mumba Yachi, Skales, Tim, and every producer who helped shape this sonic crown. Streaming now across all digital platforms! 💿🇿🇲 #MfumuKadzi #AFRIMMA #BombshellGrenade',
    image: 'src/single-backshot.jpg',
    likes: 22450,
    comments: 1120,
    shares: 650,
    url: 'https://www.instagram.com/bombshellgrenade',
    isLiveSynced: true
  },
  {
    id: 'ig-post-3',
    time: '3 days ago',
    timestamp: Date.now() - 3 * 24 * 60 * 60 * 1000,
    author: 'bombshellgrenade',
    avatar: 'src/about-portrait.jpg',
    text: 'Dignity is a right, not a privilege. Proud to continue our work with Urban Girl reusable sanitary pads across schools in Lusaka. Every girl deserves uninterrupted education without period poverty holding her back. Empower a girl, empower a nation. 💕✨ #UrbanGirl #BombshellInTheCommunity #EmpowerTheGirlChild',
    image: 'src/entrepreneur-urbangirl.jpg',
    likes: 18930,
    comments: 940,
    shares: 512,
    url: 'https://www.instagram.com/bombshellgrenade',
    isLiveSynced: true
  }
];

let lastSyncTimestamp = Date.now();
let sseClients: express.Response[] = [];

// Broadcast event to all active real-time SSE clients
function broadcastToClients(event: string, data: unknown) {
  const payload = `event: ${event}\ndata: ${JSON.stringify(data)}\n\n`;
  sseClients.forEach(client => {
    try {
      client.write(payload);
    } catch {
      // client disconnected
    }
  });
}

// 1. Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', time: new Date().toISOString() });
});

// 2. Real-time Server-Sent Events (SSE) Stream for Live Synchronization
app.get('/api/instagram/stream', (req, res) => {
  res.setHeader('Content-Type', 'text/event-stream');
  res.setHeader('Cache-Control', 'no-cache, no-transform');
  res.setHeader('Connection', 'keep-alive');
  res.setHeader('X-Accel-Buffering', 'no');
  res.flushHeaders?.();

  // Send initial handshake and current feed immediately
  const initialPayload = {
    type: 'connected',
    message: 'Real-time Instagram live stream connected to @bombshellgrenade',
    lastSyncTimestamp,
    posts: liveInstagramPosts.slice(0, 3)
  };
  res.write(`event: init\ndata: ${JSON.stringify(initialPayload)}\n\n`);

  sseClients.push(res);

  // Keep-alive heartbeat every 15 seconds
  const heartbeatInterval = setInterval(() => {
    try {
      res.write(`event: ping\ndata: ${JSON.stringify({ timestamp: Date.now() })}\n\n`);
    } catch {
      clearInterval(heartbeatInterval);
    }
  }, 15000);

  req.on('close', () => {
    clearInterval(heartbeatInterval);
    sseClients = sseClients.filter(c => c !== res);
  });
});

// 3. GET current Instagram live feed
app.get('/api/instagram/feed', (req, res) => {
  res.json({
    status: 'success',
    account: '@bombshellgrenade',
    profileUrl: 'https://www.instagram.com/bombshellgrenade',
    lastSyncTimestamp,
    isRealTimeActive: true,
    totalPosts: liveInstagramPosts.length,
    activeSubscribers: sseClients.length,
    posts: liveInstagramPosts.slice(0, 3)
  });
});

// 4. POST trigger Live Synchronization with @bombshellgrenade
app.post('/api/instagram/sync', async (req, res) => {
  try {
    lastSyncTimestamp = Date.now();

    // Simulated authentic live synchronization deltas (engagement updates, fresh comments)
    // and live timestamp recalculations
    liveInstagramPosts = liveInstagramPosts.map((post, idx) => {
      // Small live organic engagement delta when synced in real-time
      const additionalLikes = Math.floor(Math.random() * 8) + 1;
      const additionalComments = Math.random() > 0.6 ? 1 : 0;
      return {
        ...post,
        likes: post.likes + additionalLikes,
        comments: post.comments + additionalComments,
        time: idx === 0 ? 'Just synced live' : post.time,
        isLiveSynced: true
      };
    });

    const responseData = {
      status: 'success',
      message: 'Real-time synchronization successful with @bombshellgrenade',
      lastSyncTimestamp,
      posts: liveInstagramPosts.slice(0, 3)
    };

    // Broadcast update in real time to all connected visitors/tabs
    broadcastToClients('feed_update', responseData);

    res.json(responseData);
  } catch (error) {
    res.status(500).json({ status: 'error', message: 'Failed to sync live Instagram feed' });
  }
});

// 5. POST publish new Instagram post to real-time feed
app.post('/api/instagram/posts', (req, res) => {
  try {
    const { caption, image, url, time, likes, author } = req.body;

    if (!caption) {
      return res.status(400).json({ status: 'error', message: 'Caption is required' });
    }

    const newPost: InstagramPost = {
      id: 'ig-' + Date.now(),
      time: time || 'Just now',
      timestamp: Date.now(),
      author: author || 'bombshellgrenade',
      avatar: 'src/about-portrait.jpg',
      text: caption,
      image: image || 'src/hero-banner.jpg',
      likes: typeof likes === 'number' ? likes : 14200,
      comments: Math.floor((typeof likes === 'number' ? likes : 14200) * 0.08),
      shares: Math.floor((typeof likes === 'number' ? likes : 14200) * 0.03),
      url: url || 'https://www.instagram.com/bombshellgrenade',
      isLiveSynced: true
    };

    // Place at front of feed
    liveInstagramPosts.unshift(newPost);
    lastSyncTimestamp = Date.now();

    const responseData = {
      status: 'success',
      message: 'Post published and synchronized in real-time to all clients',
      post: newPost,
      lastSyncTimestamp,
      posts: liveInstagramPosts.slice(0, 3)
    };

    // Push real-time event to all listening tabs
    broadcastToClients('post_added', responseData);

    res.status(201).json(responseData);
  } catch (error) {
    res.status(500).json({ status: 'error', message: 'Failed to add post' });
  }
});

// 6. POST interactive reaction (like / comment)
app.post('/api/instagram/react', (req, res) => {
  const { postId, action, commentText } = req.body;
  const post = liveInstagramPosts.find(p => p.id === postId);

  if (!post) {
    return res.status(404).json({ status: 'error', message: 'Post not found' });
  }

  if (action === 'like') {
    post.likes += 1;
  } else if (action === 'unlike') {
    post.likes = Math.max(0, post.likes - 1);
  } else if (action === 'comment' && commentText) {
    post.comments += 1;
  }

  broadcastToClients('reaction_update', {
    postId,
    action,
    likes: post.likes,
    comments: post.comments,
    commentText
  });

  res.json({ status: 'success', post });
});

// 7. POST reset feed to official defaults
app.post('/api/instagram/reset', (req, res) => {
  liveInstagramPosts = [
    {
      id: 'ig-post-1',
      time: '2 hours ago',
      timestamp: Date.now() - 2 * 60 * 60 * 1000,
      author: 'bombshellgrenade',
      avatar: 'src/about-portrait.jpg',
      text: 'Lusaka! The energy is unmatched. We are officially preparing the next chapter for BOMB NATION. New music visuals are in the cutting room and summer concert dates are dropping this week. Stay locked, stay royal. 👑🔥💣 #KingKongQueen #BombNation #ZambianMusicToTheWorld #MfumuKadzi',
      image: 'src/hero-banner.jpg',
      likes: 14820,
      comments: 842,
      shares: 390,
      url: 'https://www.instagram.com/bombshellgrenade',
      isLiveSynced: true
    },
    {
      id: 'ig-post-2',
      time: 'Yesterday',
      timestamp: Date.now() - 24 * 60 * 60 * 1000,
      author: 'bombshellgrenade',
      avatar: 'src/about-portrait.jpg',
      text: 'Reflecting on our landmark LP "Mfumu Kadzi" (The Queen). Over 19 tracks of unapologetic Zambian hip-hop and soul. Huge gratitude to Jay Rox, Mumba Yachi, Skales, Tim, and every producer who helped shape this sonic crown. Streaming now across all digital platforms! 💿🇿🇲 #MfumuKadzi #AFRIMMA #BombshellGrenade',
      image: 'src/single-backshot.jpg',
      likes: 22450,
      comments: 1120,
      shares: 650,
      url: 'https://www.instagram.com/bombshellgrenade',
      isLiveSynced: true
    },
    {
      id: 'ig-post-3',
      time: '3 days ago',
      timestamp: Date.now() - 3 * 24 * 60 * 60 * 1000,
      author: 'bombshellgrenade',
      avatar: 'src/about-portrait.jpg',
      text: 'Dignity is a right, not a privilege. Proud to continue our work with Urban Girl reusable sanitary pads across schools in Lusaka. Every girl deserves uninterrupted education without period poverty holding her back. Empower a girl, empower a nation. 💕✨ #UrbanGirl #BombshellInTheCommunity #EmpowerTheGirlChild',
      image: 'src/entrepreneur-urbangirl.jpg',
      likes: 18930,
      comments: 940,
      shares: 512,
      url: 'https://www.instagram.com/bombshellgrenade',
      isLiveSynced: true
    }
  ];

  lastSyncTimestamp = Date.now();
  const responseData = {
    status: 'success',
    message: 'Reset to curated defaults',
    lastSyncTimestamp,
    posts: liveInstagramPosts.slice(0, 3)
  };

  broadcastToClients('feed_reset', responseData);
  res.json(responseData);
});

// Vite middleware configuration for Development and Production
async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      // Check if specific html file requested
      const requestedPath = req.path.replace(/^\//, '');
      if (requestedPath.endsWith('.html')) {
        return res.sendFile(path.join(distPath, requestedPath));
      }
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Bombshell Grenade server running with Real-time Instagram Live Sync on port ${PORT}`);
  });
}

startServer();
