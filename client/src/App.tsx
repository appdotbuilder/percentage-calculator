
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { trpc } from '@/utils/trpc';
import { useState } from 'react';
import type { 
  PercentageOfNumberInput, 
  NumberAsPercentageInput, 
  PercentageChangeInput,
  CalculationResult 
} from '../../server/src/schema';

function App() {
  // State for each calculation type
  const [percentageOfNumberData, setPercentageOfNumberData] = useState<PercentageOfNumberInput>({
    percentage: 0,
    number: 0
  });

  const [numberAsPercentageData, setNumberAsPercentageData] = useState<NumberAsPercentageInput>({
    numerator: 0,
    denominator: 0
  });

  const [percentageChangeData, setPercentageChangeData] = useState<PercentageChangeInput>({
    originalValue: 0,
    newValue: 0
  });

  // Results and loading states
  const [result1, setResult1] = useState<CalculationResult | null>(null);
  const [result2, setResult2] = useState<CalculationResult | null>(null);
  const [result3, setResult3] = useState<CalculationResult | null>(null);
  
  const [loading1, setLoading1] = useState(false);
  const [loading2, setLoading2] = useState(false);
  const [loading3, setLoading3] = useState(false);

  const [error1, setError1] = useState<string | null>(null);
  const [error2, setError2] = useState<string | null>(null);
  const [error3, setError3] = useState<string | null>(null);

  // Handler for "What is X% of Y?"
  const handlePercentageOfNumber = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading1(true);
    setError1(null);
    try {
      const response = await trpc.calculatePercentageOfNumber.mutate(percentageOfNumberData);
      setResult1(response);
    } catch (error) {
      setError1(error instanceof Error ? error.message : 'An error occurred');
    } finally {
      setLoading1(false);
    }
  };

  // Handler for "X is what percentage of Y?"
  const handleNumberAsPercentage = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading2(true);
    setError2(null);
    try {
      const response = await trpc.calculateNumberAsPercentage.mutate(numberAsPercentageData);
      setResult2(response);
    } catch (error) {
      setError2(error instanceof Error ? error.message : 'An error occurred');
    } finally {
      setLoading2(false);
    }
  };

  // Handler for "Percentage change from X to Y?"
  const handlePercentageChange = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading3(true);
    setError3(null);
    try {
      const response = await trpc.calculatePercentageChange.mutate(percentageChangeData);
      setResult3(response);
    } catch (error) {
      setError3(error instanceof Error ? error.message : 'An error occurred');
    } finally {
      setLoading3(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="container mx-auto max-w-4xl">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">🧮 Percentage Calculator</h1>
          <p className="text-lg text-gray-600">Calculate percentages with ease - three different ways!</p>
        </div>

        <Tabs defaultValue="percentage-of" className="w-full">
          <TabsList className="grid w-full grid-cols-3 mb-6">
            <TabsTrigger value="percentage-of" className="text-sm">📊 X% of Y</TabsTrigger>
            <TabsTrigger value="what-percentage" className="text-sm">🔍 X is what % of Y</TabsTrigger>
            <TabsTrigger value="percentage-change" className="text-sm">📈 % Change</TabsTrigger>
          </TabsList>

          {/* Tab 1: What is X% of Y? */}
          <TabsContent value="percentage-of">
            <Card className="shadow-lg">
              <CardHeader className="bg-blue-50">
                <CardTitle className="flex items-center gap-2">
                  📊 What is X% of Y?
                </CardTitle>
                <CardDescription>
                  Calculate a percentage of a number (e.g., "What is 15% of 200?")
                </CardDescription>
              </CardHeader>
              <CardContent className="p-6">
                <form onSubmit={handlePercentageOfNumber} className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="percentage">Percentage (%)</Label>
                      <Input
                        id="percentage"
                        type="number"
                        step="0.01"
                        placeholder="15"
                        value={percentageOfNumberData.percentage || ''}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => 
                          setPercentageOfNumberData((prev: PercentageOfNumberInput) => ({
                            ...prev,
                            percentage: parseFloat(e.target.value) || 0
                          }))
                        }
                        className="text-lg"
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="number">Number</Label>
                      <Input
                        id="number"
                        type="number"
                        step="0.01"
                        placeholder="200"
                        value={percentageOfNumberData.number || ''}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => 
                          setPercentageOfNumberData((prev: PercentageOfNumberInput) => ({
                            ...prev,
                            number: parseFloat(e.target.value) || 0
                          }))
                        }
                        className="text-lg"
                        required
                      />
                    </div>
                  </div>
                  <Button type="submit" disabled={loading1} className="w-full bg-blue-600 hover:bg-blue-700">
                    {loading1 ? '🔄 Calculating...' : '🧮 Calculate'}
                  </Button>
                </form>

                {error1 && (
                  <Alert className="mt-4 border-red-200 bg-red-50">
                    <AlertDescription className="text-red-600">❌ {error1}</AlertDescription>
                  </Alert>
                )}

                {result1 && (
                  <Alert className="mt-4 border-green-200 bg-green-50">
                    <AlertDescription className="text-green-700">
                      ✅ <strong>{result1.formattedResult}</strong>
                    </AlertDescription>
                  </Alert>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Tab 2: X is what percentage of Y? */}
          <TabsContent value="what-percentage">
            <Card className="shadow-lg">
              <CardHeader className="bg-green-50">
                <CardTitle className="flex items-center gap-2">
                  🔍 X is what percentage of Y?
                </CardTitle>
                <CardDescription>
                  Find what percentage one number is of another (e.g., "30 is what percentage of 200?")
                </CardDescription>
              </CardHeader>
              <CardContent className="p-6">
                <form onSubmit={handleNumberAsPercentage} className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="numerator">First Number (X)</Label>
                      <Input
                        id="numerator"
                        type="number"
                        step="0.01"
                        placeholder="30"
                        value={numberAsPercentageData.numerator || ''}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => 
                          setNumberAsPercentageData((prev: NumberAsPercentageInput) => ({
                            ...prev,
                            numerator: parseFloat(e.target.value) || 0
                          }))
                        }
                        className="text-lg"
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="denominator">Second Number (Y)</Label>
                      <Input
                        id="denominator"
                        type="number"
                        step="0.01"
                        placeholder="200"
                        value={numberAsPercentageData.denominator || ''}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => 
                          setNumberAsPercentageData((prev: NumberAsPercentageInput) => ({
                            ...prev,
                            denominator: parseFloat(e.target.value) || 0
                          }))
                        }
                        className="text-lg"
                        required
                      />
                    </div>
                  </div>
                  <Button type="submit" disabled={loading2} className="w-full bg-green-600 hover:bg-green-700">
                    {loading2 ? '🔄 Calculating...' : '🧮 Calculate'}
                  </Button>
                </form>

                {error2 && (
                  <Alert className="mt-4 border-red-200 bg-red-50">
                    <AlertDescription className="text-red-600">❌ {error2}</AlertDescription>
                  </Alert>
                )}

                {result2 && (
                  <Alert className="mt-4 border-green-200 bg-green-50">
                    <AlertDescription className="text-green-700">
                      ✅ <strong>{result2.formattedResult}</strong>
                    </AlertDescription>
                  </Alert>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Tab 3: Percentage change from X to Y */}
          <TabsContent value="percentage-change">
            <Card className="shadow-lg">
              <CardHeader className="bg-purple-50">
                <CardTitle className="flex items-center gap-2">
                  📈 Percentage Change from X to Y
                </CardTitle>
                <CardDescription>
                  Calculate the percentage increase or decrease between two values
                </CardDescription>
              </CardHeader>
              <CardContent className="p-6">
                <form onSubmit={handlePercentageChange} className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="originalValue">Original Value</Label>
                      <Input
                        id="originalValue"
                        type="number"
                        step="0.01"
                        placeholder="100"
                        value={percentageChangeData.originalValue || ''}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => 
                          setPercentageChangeData((prev: PercentageChangeInput) => ({
                            ...prev,
                            originalValue: parseFloat(e.target.value) || 0
                          }))
                        }
                        className="text-lg"
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="newValue">New Value</Label>
                      <Input
                        id="newValue"
                        type="number"
                        step="0.01"
                        placeholder="120"
                        value={percentageChangeData.newValue || ''}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => 
                          setPercentageChangeData((prev: PercentageChangeInput) => ({
                            ...prev,
                            newValue: parseFloat(e.target.value) || 0
                          }))
                        }
                        className="text-lg"
                        required
                      />
                    </div>
                  </div>
                  <Button type="submit" disabled={loading3} className="w-full bg-purple-600 hover:bg-purple-700">
                    {loading3 ? '🔄 Calculating...' : '🧮 Calculate'}
                  </Button>
                </form>

                {error3 && (
                  <Alert className="mt-4 border-red-200 bg-red-50">
                    <AlertDescription className="text-red-600">❌ {error3}</AlertDescription>
                  </Alert>
                )}

                {result3 && (
                  <Alert className="mt-4 border-green-200 bg-green-50">
                    <AlertDescription className="text-green-700">
                      ✅ <strong>{result3.formattedResult}</strong>
                    </AlertDescription>
                  </Alert>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        <div className="text-center mt-8 text-gray-500">
          <p className="text-sm">💡 Pro tip: Use decimal numbers for more precise calculations!</p>
        </div>
      </div>
    </div>
  );
}

export default App;
