'use client';

import {
  TextInput,
  Textarea,
  Select,
  Checkbox,
  Button,
  Group,
  Box,
  Text,
  Title,
  Container,
  Grid,
  Paper,
} from '@mantine/core';

export default function ReservationPage() {
  return (
    <Container size="xl" my={60}>
      <Grid gutter={50}>
        {/* Left Side: Info */}
        <Grid.Col span={{ base: 12, md: 5 }}>
          <Box>
            <Title order={1} style={{ fontSize: '42px', fontWeight: 900, marginBottom: '24px', lineHeight: 1.2 }}>
              문의하기
            </Title>
            <Text size="lg" style={{ marginBottom: '40px', lineHeight: 1.6, color: '#495057' }}>
              <br />현재 진행되고 있는 정비사업 조합 프로젝트 및 민간개발에 <br />대해 문의하여 가장 합리적인 공사비에 대해 알아보세요.
            </Text>
            


            {/* Testimonial Box */}
            <Paper p="xl" radius="md" bg="gray.0">
                <Text size="md" style={{ lineHeight: 1.7, marginBottom: '20px' }}>
                    “본 서비스는 공사 현장에서 실제로 사용되는 자재와 상품, 시공 단가를 자세히 조사하여 조합이 객관적이고 합리적인 공사비를 판단할 수 있도록 도와드립니다.
브랜드별 자재 가격, 시공 방식에 따른 단가 차이, 최근 시장 동향 등 다양한 정보를 기반으로 총 공사비가 어떻게 구성되는지 명확하게 이해할 수 있습니다.
이를 통해 과도한 공사비 책정이나 불필요한 비용을 피하고, 사업에 적합한 수준의 합리적인 공사비를 산정할 수 있습니다.
정비사업에서 핵심이 되는 ‘투명성’과 ‘예측 가능성’을 높이는 데 중점을 둔 서비스입니다.”
                </Text>
                {/* <Box>
                    <Text fw={700} size="sm">Nick Erdenberger</Text>
                    <Text size="xs" c="dimmed">GTM, OpenAI</Text>
                </Box> */}
            </Paper>
          </Box>
        </Grid.Col>

        <Grid.Col span={{ base: 12, md: 7 }}>
            <Box pl={{ md: 40 }} mt={160}>
                <Group grow mb="md">
                    <TextInput 
                        label="성명 *" 
                        placeholder="홍길동" 
                        styles={{ label: { marginBottom: 6, fontWeight: 600 } }} 
                    />
                    <TextInput 
                        label="전화번호 *" 
                        placeholder="(010) 0000-0000" 
                        styles={{ label: { marginBottom: 6, fontWeight: 600 } }} 
                    />
                </Group>

                <Group mb="md" align="flex-start">
                    <TextInput 
                        label="이메일 *" 
                        placeholder="" 
                        style={{ flex: 1 }}
                        styles={{ label: { marginBottom: 6, fontWeight: 600 } }} 
                    />
                    <Select
                        label="지역"
                        placeholder="선택"
                        data={[
                            '강원도',
                            '경기도',
                            '경상도',
                            '서울특별시',
                            '인천광역시',
                            '전라도',
                            '제주도',
                            '충청도'
                        ]}
                        style={{ flex: 1 }}
                        styles={{ label: { marginBottom: 6, fontWeight: 600 } }} 
                    />
                </Group>

                <Textarea
                    label="문의 내용을 간략히 제공해 주세요."
                    placeholder="어떤 내용을 문의하시겠습니까?"
                    minRows={4}
                    mb="xl"
                    styles={{ label: { marginBottom: 6, fontWeight: 600 } }} 
                />


                <Button size="lg" color="dark" radius="md" style={{ backgroundColor: '#212529' }}>
                   문의하기
                </Button>
            </Box>
        </Grid.Col>
      </Grid>
    </Container>
  );
}
