'use client';

import { useEffect, useRef, useState, useCallback } from 'react';
import * as PIXI from 'pixi.js';
import { Box } from '@mui/material';
import { gsap } from 'gsap';

interface ImageRotatorProps {
  baseURL?: string;
  spriteSheets?: {
    [key: string]: {
      prefix: string;
      type: string;
      data: Array<{ file: string; size: number }>;
    };
  };
  imageName?: string;
}

// Product Sprite class
class ProductSprite extends PIXI.Sprite {
  private _frames: PIXI.Texture[];
  private _total: number;

  constructor(frames: PIXI.Texture[]) {
    super(frames[0]);
    this._frames = frames;
    this._total = frames.length;
  }

  set frame(n: number) {
    this.texture = this._frames[n % this._total];
  }
}

export default function ImageRotator({
  baseURL = 'https://s3-us-west-2.amazonaws.com/s.cdpn.io/106114/',
  spriteSheets = {
    mario: {
      prefix: 'img',
      type: '.png',
      data: [
        { file: 'mario2.json', size: 10 },
        { file: 'mario3.json', size: 10 },
      ],
    },
  },
  imageName = 'mario',
}: ImageRotatorProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [rotation, setRotation] = useState(0);
  const [isReady, setIsReady] = useState(false);
  const [textures, setTextures] = useState<PIXI.Texture[]>([]);
  const [width, setWidth] = useState(0);
  const [height, setHeight] = useState(0);

  const appRef = useRef<PIXI.Application | null>(null);
  const spriteRef = useRef<ProductSprite | null>(null);
  const lastXRef = useRef(0);
  const lastYRef = useRef(0);
  const isDraggingRef = useRef(false);
  const rotationRef = useRef(0);
  const dirtyRef = useRef(true);

  // Load assets
  useEffect(() => {
    const loadAssets = async () => {
      const spriteSheet = spriteSheets[imageName];
      if (!spriteSheet) return;

      try {
        const allFrames: PIXI.Texture[] = [];
        let count = 1;

        for (const data of spriteSheet.data) {
          // Load the JSON sprite sheet file
          const response = await fetch(`${baseURL}${data.file}`);
          if (!response.ok) {
            throw new Error(`Failed to load ${data.file}`);
          }
          
          const json = await response.json();
          
          // Get the image path from the sprite sheet JSON
          const imagePath = json.meta?.image || json.image || '';
          if (!imagePath) {
            throw new Error(`No image path found in ${data.file}`);
          }
          
          // Load the base texture (the sprite sheet image)
          const baseTextureURL = `${baseURL}${imagePath}`;
          const baseTexture = PIXI.Texture.from(baseTextureURL);
          
          // Wait for base texture to load
          await new Promise<void>((resolve, reject) => {
            const checkLoaded = () => {
              const bt = baseTexture.baseTexture;
              if (bt.width > 0 && bt.height > 0) {
                resolve();
              } else {
                bt.once('loaded', () => resolve());
                bt.once('error', reject);
                // Timeout after 10 seconds
                setTimeout(() => reject(new Error('Texture load timeout')), 10000);
              }
            };
            checkLoaded();
          });

          // Create textures from frames in the sprite sheet
          for (let i = 0; i < data.size; i++) {
            const index = i + count;
            const frameName = `${spriteSheet.prefix}${index.toString().padStart(2, '0')}${spriteSheet.type}`;
            
            let texture: PIXI.Texture | null = null;
            
            // Try to find the frame in the JSON
            if (json.frames) {
              let frameData = null;
              
              // Handle different sprite sheet formats
              if (Array.isArray(json.frames)) {
                // Array format
                frameData = json.frames.find((f: any) => 
                  f.filename === frameName || f.name === frameName
                );
              } else {
                // Object format - frame name as key
                frameData = json.frames[frameName];
              }
              
              if (frameData) {
                // Extract frame rectangle
                const frame = frameData.frame || frameData;
                if (frame.x !== undefined && frame.y !== undefined && 
                    frame.w !== undefined && frame.h !== undefined) {
                  // Create texture from frame rectangle
                  texture = new PIXI.Texture(
                    baseTexture.baseTexture,
                    new PIXI.Rectangle(frame.x, frame.y, frame.w, frame.h)
                  );
                } else if (frame.x !== undefined && frame.y !== undefined && 
                           frame.width !== undefined && frame.height !== undefined) {
                  // Alternative format with width/height
                  texture = new PIXI.Texture(
                    baseTexture.baseTexture,
                    new PIXI.Rectangle(frame.x, frame.y, frame.width, frame.height)
                  );
                }
              }
            }
            
            // Fallback: if frame not found in JSON, try to load as individual image
            if (!texture) {
              try {
                texture = PIXI.Texture.from(`${baseURL}${frameName}`);
                // Wait for texture to load
                await new Promise<void>((resolve, reject) => {
                  const checkLoaded = () => {
                    const bt = texture!.baseTexture;
                    if (bt.width > 0 && bt.height > 0) {
                      resolve();
                    } else {
                      bt.once('loaded', () => resolve());
                      bt.once('error', reject);
                      setTimeout(() => reject(new Error('Texture load timeout')), 5000);
                    }
                  };
                  checkLoaded();
                });
              } catch (err) {
                console.warn(`Could not load frame ${frameName}, skipping`);
                continue;
              }
            }
            
            if (texture) {
              allFrames.push(texture);
            }
          }
          
          // Update count for next sprite sheet (original logic: count = data.size)
          // This means the next sprite sheet continues from where this one ended
          count += data.size;
        }

        if (allFrames.length > 0) {
          setTextures(allFrames);
          setWidth(allFrames[0].width);
          setHeight(allFrames[0].height);
          setIsReady(true);
          console.log(`Successfully loaded ${allFrames.length} frames for ${imageName}`);
        } else {
          throw new Error('No frames were loaded');
        }
      } catch (error) {
        console.error('Error loading assets:', error);
        // Fallback: create placeholder textures
        const placeholderTextures: PIXI.Texture[] = [];
        for (let i = 0; i < 20; i++) {
          const canvas = document.createElement('canvas');
          canvas.width = 400;
          canvas.height = 400;
          const ctx = canvas.getContext('2d');
          if (ctx) {
            ctx.fillStyle = `hsl(${(i * 360) / 20}, 70%, 60%)`;
            ctx.fillRect(0, 0, 400, 400);
            ctx.fillStyle = 'white';
            ctx.font = '48px Arial';
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.fillText(`${i + 1}`, 200, 200);
          }
          placeholderTextures.push(PIXI.Texture.from(canvas));
        }
        setTextures(placeholderTextures);
        setWidth(400);
        setHeight(400);
        setIsReady(true);
      }
    };

    loadAssets();
  }, [baseURL, spriteSheets, imageName]);

  // Initialize PIXI app
  useEffect(() => {
    if (!isReady || !containerRef.current || textures.length === 0) return;

    let app: PIXI.Application | null = null;
    
    const initApp = () => {
      try {
        app = new PIXI.Application({
          width: width,
          height: height,
          backgroundColor: 0xffffff,
          antialias: true,
          resolution: window.devicePixelRatio || 1,
        });

        if (!containerRef.current || !app) {
          console.error('Failed to initialize PIXI Application or container is missing');
          return;
        }
        
        const view = app.view as HTMLCanvasElement;
        if (view && containerRef.current) {
          containerRef.current.appendChild(view);
        } else {
          console.error('PIXI Application view is missing');
          return;
        }
      } catch (error) {
        console.error('Error initializing PIXI Application:', error);
        return;
      }

      if (!app) {
        console.error('PIXI Application was not created');
        return;
      }
      
      const sprite = new ProductSprite(textures);
      sprite.anchor.set(0.5);
      sprite.x = width / 2;
      sprite.y = height / 2;
      app.stage.addChild(sprite);

      spriteRef.current = sprite;
      appRef.current = app;

      // Set initial size
      if (containerRef.current) {
        gsap.set(containerRef.current, { width: width, height: height });
      }
    };

    initApp();

    return () => {
      const app = appRef.current;
      if (!app) return;
      
      try {
        // Remove canvas from DOM first
        if (containerRef.current) {
          const view = (app as any).view || (app as any).canvas;
          if (view && view.parentNode === containerRef.current) {
            try {
              containerRef.current.removeChild(view);
            } catch (e) {
              // Canvas might already be removed
            }
          }
        }
        
        // Destroy the app - check if destroy method exists
        if (app && typeof (app as any).destroy === 'function') {
          try {
            // Try PIXI.js v8 destroy signature
            (app as any).destroy(true);
          } catch (destroyError) {
            // If that fails, try v7 signature
            try {
              (app as any).destroy(true, { children: true, texture: true, baseTexture: true });
            } catch (e) {
              console.warn('Could not destroy PIXI app with standard methods');
            }
          }
        }
      } catch (error) {
        console.error('Error destroying PIXI app:', error);
      } finally {
        appRef.current = null;
      }
    };
  }, [isReady, textures, width, height]);

  // Handle resize
  const handleResize = useCallback(() => {
    if (!containerRef.current || !width || !height) return;
    
    const vw = window.innerWidth;
    const vh = window.innerHeight;
    const scale = Math.min(Math.min(vw / width, vh / height), 1);
    
    if (containerRef.current) {
      gsap.set(containerRef.current, { scale });
    }
  }, [width, height]);

  // Resize effect
  useEffect(() => {
    if (!isReady) return;
    
    handleResize();
    window.addEventListener('resize', handleResize);
    
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, [isReady, handleResize]);

  // Render loop
  useEffect(() => {
    if (!appRef.current || !spriteRef.current) return;

    const app = appRef.current;
    let animationFrameId: number;

    const render = () => {
      if (dirtyRef.current) {
        handleResize();
        dirtyRef.current = false;
      }
      app.render();
      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      if (animationFrameId) {
        cancelAnimationFrame(animationFrameId);
      }
    };
  }, [handleResize]);

  // Drag handlers
  useEffect(() => {
    if (!isReady || !containerRef.current) return;

    const container = containerRef.current;

    const handleMouseDown = (e: MouseEvent) => {
      isDraggingRef.current = true;
      lastXRef.current = e.clientX;
      lastYRef.current = e.clientY;
      e.preventDefault();
    };

    const handleMouseMove = (e: MouseEvent) => {
      if (!isDraggingRef.current) return;

      const dx = e.clientX - lastXRef.current;
      rotationRef.current += dx;
      setRotation(rotationRef.current % 360);

      lastXRef.current = e.clientX;
      lastYRef.current = e.clientY;
    };

    const handleMouseUp = () => {
      isDraggingRef.current = false;
    };

    const handleTouchStart = (e: TouchEvent) => {
      if (e.touches.length > 0) {
        isDraggingRef.current = true;
        lastXRef.current = e.touches[0].clientX;
        lastYRef.current = e.touches[0].clientY;
        e.preventDefault();
      }
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (!isDraggingRef.current || e.touches.length === 0) return;

      const dx = e.touches[0].clientX - lastXRef.current;
      rotationRef.current += dx;
      setRotation(rotationRef.current % 360);

      lastXRef.current = e.touches[0].clientX;
      lastYRef.current = e.touches[0].clientY;
    };

    const handleTouchEnd = () => {
      isDraggingRef.current = false;
    };

    container.addEventListener('mousedown', handleMouseDown);
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);
    container.addEventListener('touchstart', handleTouchStart);
    container.addEventListener('touchmove', handleTouchMove);
    container.addEventListener('touchend', handleTouchEnd);

    return () => {
      container.removeEventListener('mousedown', handleMouseDown);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
      container.removeEventListener('touchstart', handleTouchStart);
      container.removeEventListener('touchmove', handleTouchMove);
      container.removeEventListener('touchend', handleTouchEnd);
    };
  }, [isReady]);

  // Update sprite frame based on rotation
  useEffect(() => {
    if (!spriteRef.current || textures.length === 0) return;

    const total = textures.length - 1;
    const ratio = rotation / 360;
    let index = Math.round(ratio * total);

    if (index < 1) {
      index = total + index;
    } else {
      index = index - 1;
    }

    spriteRef.current.frame = total - index;
  }, [rotation, textures.length]);

  if (!isReady) {
    return (
      <Box
        sx={{
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: 'white',
        }}
      >
        Loading...
      </Box>
    );
  }

  return (
    <Box
      ref={containerRef}
      sx={{
        width: `${width}px`,
        height: `${height}px`,
        cursor: 'ew-resize',
        userSelect: 'none',
        touchAction: 'none',
      }}
    />
  );
}
