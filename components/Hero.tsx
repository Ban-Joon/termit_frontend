'use client';

import Link from 'next/link';
import { Container, Title, Text, Button, Overlay, Box } from '@mantine/core';

export function Hero() {
  return (
    <div style={{ position: 'relative', height: 'calc(100vh - 70px)' }}>
      {/* Background Image */}
      <div 
        style={{ 
          position: 'absolute', 
          top: 0, 
          left: 0, 
          right: 0, 
          bottom: 0, 
          backgroundImage: 'url(/main_bg_new.png)', 
          backgroundSize: 'cover', 
          backgroundPosition: 'center',
          filter: 'brightness(1.0)',
          zIndex: -1 
        }} 
      />
      
      {/* Gradient Overlay for text readability */}
      <div 
         style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'linear-gradient(90deg, rgba(255,255,255,1) 0%, rgba(255,255,255,0.9) 0%, rgba(255,255,255,0) 100%)',
            zIndex: 0
         }}
      />

      <Container size="xl" style={{ height: '100%', position: 'relative', zIndex: 1 }}>
        <Box style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', height: '100%', maxWidth: '600px' }}>
          <Title 
            order={1} 
            style={{ 
              fontSize: '36px', 
              lineHeight: 1.2, 
              fontWeight: 800, 
              marginBottom: '24px', 
              color: '#333' 
            }}
          >
            미래의 내집 분담금 분석<br />
            터밋이 밝혀드립니다.
          </Title>
          
          <Text size="lg" style={{ marginBottom: '48px', fontSize: '24px', lineHeight: 1.6, fontWeight: 600, color: '#333' }}>
            실시간 업데이트되는 데이터를 기반으로 <br />
            가장 정확한 분석 결과를 제공합니다.
          </Text>

          <Link href="/contribution-map" passHref>
            <Button 
              size="xl" 
              color="blue" 
              radius="md" 
              style={{ 
                width: 'fit-content',
                fontSize: '18px',
                fontWeight: 600,
                padding: '0 40px'
              }}
            >
              TERMIT 시작하기
            </Button>
          </Link>
        </Box>
      </Container>
    </div>
  );
}
