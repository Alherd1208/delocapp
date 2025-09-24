import { NextResponse } from 'next/server'
import { exec } from 'child_process'
import { promisify } from 'util'

const execAsync = promisify(exec)

export async function GET() {
    try {
        // Get the latest commit information
        const { stdout } = await execAsync('git log -1 --pretty=format:"%h - %s"')
        const commitInfo = stdout.trim()

        return NextResponse.json({ commitInfo })
    } catch (error) {
        console.error('Error getting commit info:', error)
        // Return fallback commit info
        return NextResponse.json({
            commitInfo: 'a957f3e - add debug 3'
        })
    }
}
